# kuali-days-2017-elasticsearch

Source code associated with the Elasticsearch presentation at Austin Kuali Days 2017

## Prerequisites

- Docker

## Setup

```
git clone git@github.com:kldavis4/kuali-days-2017-elasticsearch.git
cd kuali-days-2017-elasticsearch/docker
docker-compose up
curl http://127.0.0.1:9200/_cluster/health?pretty=true
```
## Folders

- wikipedia: Sample application for indexing wikipedia
- grades: Sample data for demonstrating single value Metrics aggregation
- latency: Sample data for demonstrating multi value Metrics aggregation
- products: Sample data for demonstrating range and terms bucket aggregation
- weather-data: Sample data for demonstrating Sibling Pipeline Aggregations
- weather-data-deaths: Sample data for demonstrating Parent Pipeline Aggregations

## Cerebro Interface

Go to http://127.0.0.1:9000 and connect to http://elasticsearch1:9200

![Cerebro Login](https://github.com/kldavis4/kuali-days-2017-elasticsearch/raw/master/cerebro_login.png "Cerebro Login")

