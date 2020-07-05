# Web Scraping

Just a simple Web Scraping service running on cloud to learn:

- Amazon Kinesis
- Amazon Athena

![Design](/assets/web-scraping.png)

## Useful commands

Deploy the Service

```bash
    serverless deploy -v
```

Deploy a Function

```bash
    serverless deploy function -f Scraping
```

Invoke the Function

```bash
    serverless invoke -f Scraping -l
```

Fetch the Function Logs

```bash
    serverless logs -f Scraping -t
```

Cleanup

```bash
    serverless remove
```

Invoke with mock

```bash
    serverless invoke --function Scraping --path ./mocks/scraping.json
```
