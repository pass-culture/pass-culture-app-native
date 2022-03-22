## Debugging in Circle-CI

In case of failure, if you are the CI owner, you can use ssh on any failed job to start debugging a pipeline.

## Use ruby in Circle-CI SSH session

To find your ruby installation, you can run:

```bash
find / -name ruby -type f | grep bin/ruby
```

You can update the `PATH` environment variable:

```bash
export PATH="$PATH:/home/circleci/.rubies/ruby-2.6.1/bin"
```

