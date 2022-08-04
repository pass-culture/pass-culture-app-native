# Performance testing

## Usage

```
yarn
```

Then in one terminal:

```
yarn appium
```

and in another, run:

```
yarn test
```

Finally open the generated report:

```
npx @perf-profiler/web-reporter results.json
```

You can also compare multiple reports:

```
npx @perf-profiler/web-reporter results1.json results2.json results3.json
```

Check https://github.com/bamlab/android-performance-profiler for more, feel free to submit issues/requests
