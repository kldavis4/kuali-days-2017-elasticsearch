# Weather Data Deaths - Parent Pipeline Aggregations Demo

Adapted from https://qbox.io/blog/introduction-pipeline-aggregations

# Setup

## Create index

`curl -XPUT http://127.0.0.1:9200/weather-data-deaths -d @createindex.json`

## Index weather data

`curl -H "Content-Type: application/ndjson" -XPOST http://127.0.0.1:9200/_bulk --data-binary @bulkindex.json`

# Aggregations

## Weather related deaths by month
```
POST /weather-data-deaths/_search
{
  "size": 0,
  "aggs": {
    "temp": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly": {
          "sum": {
            "field": "relatedDeaths"
          }
        }
      }
    }
  }
}
```

# Pipeline Aggregations

## Total weather related deaths in NY state (Sibling)
```
POST /weather-data-deaths/_search
{
  "size": 0,
  "query": {
    "match": {
      "state": "NY"
    }
  },
  "aggs": {
    "temp": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly": {
          "sum": {
            "field": "relatedDeaths"
          }
        }
      }
    },
    "sum_bucket_demo": {
      "sum_bucket": {
        "buckets_path": "temp>monthly"
      }
    }
  }
}
```

## Cumulative Sum of Monthly Weather Related Deaths for NY state (Parent)

```
POST /weather-data-deaths/_search
{
  "size": 0,
  "query": {
    "match": {
      "state": "NY"
    }
  },
  "aggs": {
    "temp": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly": {
          "sum": {
            "field": "relatedDeaths"
          }
        },
        "cumulative_demo": {
          "cumulative_sum": {
            "buckets_path": "monthly"
          }
        }  
      }
    }
  }
}
```

## First Derivative of Monthly Weather Related Deaths for NY state (Parent)

```
POST /weather-data-deaths/_search
{
  "size": 0,
  "query": {
    "match": {
      "state": "NY"
    }
  },
  "aggs": {
    "temp": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly": {
          "avg": {
            "field": "relatedDeaths"
          }
        },
        "derivative": {
          "derivative": {
            "buckets_path": "monthly"
          }
        }
      }
    }
  }
}
```
