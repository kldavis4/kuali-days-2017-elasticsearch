const bz2 = require('unbzip2-stream')
const { bulkIndex } = require('./elasticsearch')
const config = require('config')
const fs = require('fs')
const http = require('http')
const sax = require('sax')
const { Writable } = require('stream')

const parser = sax.createStream(true)

const COOL_NODES = [
  'text',
  'title',
  'id',
  'timestamp',
  'model',
  'format',
  'parentid'
]

const BUFFER_LIMIT = 285

let curPage = {}
let curNode = null

const start = Date.now()
let total = 0
let count = 0
let pageCount = 0

parser.onerror = function (e) {
  // an error happened.
  console.error('ERROR', e)
  this._parser.error = null
  this._parser.resume()
}

parser.ontext = t => {
  if (curPage && t && t.trim()) {
    if (COOL_NODES.indexOf(curNode) !== -1) {
      curPage[curNode] = t
    }
  }
}
parser.on('opentag', node => {
  curNode = node.name
})

var pageBuffer = []

parser.on('closetag', node => {
  if (curPage && node === 'page') {
    pageBuffer.push(curPage)

    pageCount = pageCount + 1
    curPage = {}
  }
})

parser.on('end', () => {
  console.log('Parsed finished reading ' + pageCount + ' articles')
})

const indexPages = () => {
  return new Promise(async (resolve, reject) => {
    readStream.pause()
    var tasks = pageBuffer.splice(0, pageBuffer.length)
    const batchStart = Date.now()
    count = count + 1
    console.log('Sending ' + tasks.length + ' pages')
    let body = []
    for (let i = 0; i < tasks.length; i++) {
      body.push(
        `{ "index" : { "_index" : "${config.get('es.index')}", "_type" : "article" } }\n`
      )
      body.push(`${JSON.stringify(tasks[i])}\n`)
    }

    // console.log(body)
    let result
    let err

    try {
      result = await bulkIndex(body.join(''))
    } catch (e) {
      err = e
    }

    readStream.resume()
    if (err) {
      if (result && result.retry === true) {
        console.log('failure with retry!')
        reject(err) // todo fix to actually retry
      } else {
        console.error('==Fatal error==')
        console.log(err.original.response.status)
        console.error(body)
        reject(err)
      }
    } else {
      let errorCount = 0
      if (result.details.errors === true) {
        console.error('Batch has errors!')
        for (let i = 0; i < result.details.items.length; i++) {
          const item = result.details.items[i]
          if (item.index.status !== 201) {
            q.push(tasks[i])
            errorCount = errorCount + 1
          }
        }
      }
      total = total + tasks.length - errorCount
      const now = Date.now()
      const totalElapsedSecs = ((now - start) / 1000).toFixed(2)
      const batchElapsedSecs = ((now - batchStart) / 1000).toFixed(2)
      console.log(
        `batch ${count} - ${tasks.length -
          errorCount} pages (${errorCount}) in ${batchElapsedSecs} secs @ ${((tasks.length -
          errorCount) /
          batchElapsedSecs).toFixed(
          2
        )} pages/sec. ${total} total pages in ${totalElapsedSecs} secs @ ${(total /
          totalElapsedSecs).toFixed(2)} pages/sec`
      )
      resolve()
    }
  })
}

const esWriter = new Writable({
  write: async (chunk, encoding, callback) => {
    if (pageBuffer.length >= BUFFER_LIMIT) {
      await indexPages()
    }
    callback()
  },
  objectMode: true
})

const readStream = fs
  .createReadStream(config.get('contentFile'))

readStream
  .pipe(bz2())
  .pipe(parser)
  .pipe(esWriter)

readStream
  .on('end', async () => {
    if (pageBuffer.length > 0) {
      await indexPages()
    }

    console.log(`Finished indexing ${total} articles`)
  })
