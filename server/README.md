## App Engine web-proxy

### Push

```bash
GCP_PROJECT=passculture-metier-ehp
gcloud --project="$GCP_PROJECT" app deploy app.yaml
```

#### View logs

Use the service name from `app.yaml`
    
```bash
GCP_SERVICE_NAME=web-server-testing
gcloud app logs tail -s "$GCP_SERVICE_NAME"
```

### List all App Engine services

```bash
gcloud --project="$GCP_PROJECT" app services list"
```


### Remove App Engine service

```bash
GCP_PROJECT=passculture-metier-ehp
GCP_SERVICE_NAME=web-server-testing
gcloud --project="$GCP_PROJECT" app services delete "$GCP_SERVICE_NAME"
```
