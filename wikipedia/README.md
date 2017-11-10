# Wikipedia Article Indexer

Node script to parse wikipedia article dump and index it to Elasticsearch.

## Prerequisites

- Node >= v8.5.0
- yarn
- Elasticsearch >= 5.6

## Configuration

Start by modifying the configuration in `config` to point to your Elasticsearch cluster. Set the article dump file. Alternatively, environment variables can be specified (see `config/custom-environment-variables.js`). 

### Create Index / Mapping

```
curl -XPUT http://localhost:9200/wikipedia_sample -d @createindex.json 
curl -XPUT http://localhost:9200/wikipedia_sample/_mapping/article -d @updatemapping.json
```

### Install dependencies

`yarn`

## Start Indexing

`node index.js`

## Index all of english wikipedia

Download https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles.xml.bz2

`CONTENT_FILE=./enwiki-latest-pages-articles.xml.bz2 node index.js`

## Sample Queries

### Match All

```
POST wikipedia_sample/_search
{
  "query" : {
    "match_all": {}
  }
}
```

## Full Text Search

```
POST wikipedia_sample/_search
{
  "query" : {
    "query_string": {
      "query" : "poodles"
    }
  }
}
```

## Term query

```
POST wikipedia_sample/_search
{
  "query": {
    "term": {
      "title": "amsterdam"
    }
  }
}
```

## Compound Query
```
POST wikipedia_sample/_search
{
  "query": {
    "bool": {
      "must": {
        "term": {
          "title": "ajax"
        }
      },
      "must_not": {
        "term": {
          "text": "programming"
        }
      }
    }
  }
}
```

## Filter
```
POST wikipedia_sample/_search
{
  "query": {
    "bool": {
      "must": {
        "query_string": {
          "query": "telamon"
        }
      },
      "filter": [
        {
          "term": {
            "title": "ajax"
          }
        }
      ]
    }
  }
}
```
