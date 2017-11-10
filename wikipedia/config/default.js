/* Copyright © 2016 Kuali, Inc. - All Rights Reserved
 * You may use and modify this code under the terms of the Kuali, Inc.
 * Pre-Release License Agreement. You may not distribute it.
 *
 * You should have received a copy of the Kuali, Inc. Pre-Release License
 * Agreement with this file. If not, please write to license@kuali.co.
 */

'use strict'

const pkg = require('../package')

module.exports = {
  es: {
    host: '127.0.0.1',
    port: 9200,
    index: 'wikipedia_sample'
  },
  contentFile: 'enwiki-latest-pages-articles-sample.xml.bz2'
}
