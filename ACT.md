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

```shell
act --workflows .github/workflows/pr.yml --platform ubuntu-22.04=catthehacker/ubuntu:full-22.04 --secret GITHUB_TOKEN="$(gh auth token)" --eventpath act/event.json --env-file .env.testing
```