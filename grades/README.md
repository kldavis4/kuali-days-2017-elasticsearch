# Grades - Metrics Aggregations Demo

# Setup

## Create index

`curl -XPUT http://127.0.0.1:9200/exams -d @createindex.json`

## Index exam data

`curl -H "Content-Type: application/ndjson" -XPOST http://127.0.0.1:9200/_bulk --data-binary @bulkindex.json`

# Metrics Aggregations

## Average Grade
```
POST /exams/_search
{
  "size" : 0,
  "aggs" : {
    "avg_grade" : { 
      "avg" : { 
        "field" : "grade" 
      } 
    }
  }
}
```
