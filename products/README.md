# Products - Bucket Aggregations Demo

# Setup

## Create index

`curl -XPUT http://127.0.0.1:9200/products -d @createindex.json`

## Index product data

`curl -H "Content-Type: application/ndjson" -XPOST http://127.0.0.1:9200/_bulk --data-binary @bulkindex.json`

# Range Aggregation

## Price range counts
```
POST /products/woks/_search
{
  "size" : 0,
  "aggs" : {
    "price_ranges" : { 
      "range" : {
          "field" : "price",
          "ranges" : [
              { "to" : 50 },
              { "from" : 50, "to" : 75 },
              { "from" : 75 }
          ]
      }
    }
  }
}
```

## Price range average in range
```
POST /products/woks/_search
{
  "size" : 0,
  "aggs" : {
    "price_ranges" : {
      "range" : {
          "field" : "price",
          "ranges" : [
              { "to" : 50 },
              { "from" : 50, "to" : 75 },
              { "from" : 75 }
          ]
      },
      "aggs": {
        "avg_in_range": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

# Terms Aggregation

## Brands Facet
```
POST /products/woks/_search
{
    "size" : 0,
    "aggs" : {
        "brands" : {
            "terms" : { "field" : "brand" }
        }
    }
}
```