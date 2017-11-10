# Weather Data - Sibling Pipeline Aggregations Demo

Adapted from https://qbox.io/blog/introduction-pipeline-aggregations

# Setup

## Create index

`curl -XPUT http://127.0.0.1:9200/weather-data -d @createindex.json`

## Index weather data

`curl -H "Content-Type: application/ndjson" -XPOST http://127.0.0.1:9200/_bulk --data-binary @bulkindex.json`

# Aggregations

## Date histogram
```
POST /weather-data/_search?size=0
{
    "aggregations" : {
        "temps_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            }
        }
    }
}
```

## Date histogram with average temp

```
POST /weather-data/_search?size=0
{
    "aggregations" : {
        "temps_per_month" : {
            "date_histogram" : {
                "field" : "date",
                "interval" : "month"
            },
            "aggs": {
              "monthly_avg": {
                "avg": {
                  "field": "temp"
                }
              }
            }
        }
    }
}
```

# Pipeline Aggregations

## Average of monthly averages

```
POST /weather-data/_search?size=0
{
  "aggs": {
    "temps_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly_avg": {
          "avg": {
            "field": "temp"
          }
        }
      }
    },
    "avg_monthly_temp": {
      "avg_bucket": {
        "buckets_path": "temps_per_month>monthly_avg"
      }
    }
  }
}
```

## Max of monthly averages

```
POST /weather-data/_search?size=0
{
  "aggs": {
    "temps_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly_avg": {
          "avg": {
            "field": "temp"
          }
        }
      }
    },
    "max_monthly_average": {
      "max_bucket": {
        "buckets_path": "temps_per_month>monthly_avg"
      }
    }
  }
}
```

## Min of monthly averages
```
POST /weather-data/_search?size=0
{
  "aggs": {
    "temps_per_month": {
      "date_histogram": {
        "field": "date",
        "interval": "month",
        "format": "dd-MM-yyyy"
      },
      "aggs": {
        "monthly_avg": {
          "avg": {
            "field": "temp"
          }
        }
      }
    },
    "min_monthly_average": {
      "min_bucket": {
        "buckets_path": "temps_per_month>monthly_avg"
      }
    }
  }
}
```

