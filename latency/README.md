# Latency - Metrics Aggregations Demo

# Setup

## Create index

`curl -XPUT http://127.0.0.1:9200/latency -d @createindex.json`

## Index latency data

`curl -H "Content-Type: application/ndjson" -XPOST http://127.0.0.1:9200/_bulk --data-binary @bulkindex.json`

# Metrics Aggregations

## Load Time Percentils
```
POST /latency/data/_search?size=0
{
  "aggs" : {
    "load_time_outlier" : { 
      "percentiles" : { 
        "field" : "load_time" 
      } 
    }
  }
}
```
