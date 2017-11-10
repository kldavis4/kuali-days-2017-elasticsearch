const axios = require('axios')
const config = require('config')

/**
 * Make ES base url
 *
 */
const makeEsUrl = () => {
  const esHost = config.get('es.host')
  const esPort = config.get('es.port')
  return `http://${esHost}${
    !esPort || esPort === 80 || esPort === 443 ? '' : ':' + esPort}`
}

/**
 * Make ES Index Url
 *
 */
const makeEsIndexUrl = () => `${makeEsUrl()}${config.get('es.index')}`

/**
 * Make headers for ES request
 */
const makeHeaders = (contentType = 'application/json') => {
  return {
    'Content-Type': contentType
  }
}

/**
 * Send bulk index request
 *
 * @param {String} body request body
 */
const bulkIndex = (body) => {
  return new Promise(async (resolve, reject) => {
    const url = `${makeEsUrl()}/_bulk`
    const headers = makeHeaders('application/x-ndjson')

    try {
      const res = await axios({
        method: 'POST',
        data: body,
        url,
        headers
      })

      resolve({ retry: false, details: res.data })
    } catch (err) {
      if (err.code === 'ECONNRESET' || err.response.status === 429) {
        reject({original: err, retry: true})
      } else {
        console.error('ERROR: ' + err.response.status)
        reject({original: err, retry: false, statusCode: err.response.status})
      }
    }
  })
}

module.exports = {
  bulkIndex
}
