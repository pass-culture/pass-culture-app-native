# ACT

## Requirements

- act
- github cli
- podman

### Podman configuration

```shell
podman machine init --cpus 4 --memory 8192 --now gha-act
```

## Local testing

act -W .github/workflows/pr.yml -P ubuntu-22.04=catthehacker/ubuntu:full-22.04 -s GITHUB_TOKEN="$(gh auth token)" --eventpath act/event.json --env-file .env.testing
