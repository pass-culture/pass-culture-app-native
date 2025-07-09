const fs = require('fs')
const {
  averageTestCaseResult,
  getAverageCpuUsage,
  getAverageCpuUsagePerProcess,
  getAverageFPSUsage,
  getAverageRAMUsage,
  getScore,
} = require('@perf-profiler/reporter')

const THREADS_TO_MONITOR = ['UI Thread', 'mqt_js', 'RenderThread']

const C_BLUE = '\x1b[1;34m'
const C_GREEN = '\x1b[1;32m'
const C_RED = '\x1b[1;31m'
const C_YELLOW = '\x1b[1;33m'
const C_RESET = '\x1b[0m'

const logTitle = (title) => console.log(`\n${C_BLUE}===== ${title} =====${C_RESET}`)
const logMetric = (name, value) => console.log(`  - ${name.padEnd(25, ' ')}${value}`)

const logError = (message) => {
  console.error(`\n${C_RED}[ERROR] ==> ${message}${C_RESET}`)
}

const toInt = (num) => Math.round(num || 0)

const average = (numbers) => {
  if (!numbers || numbers.length === 0) return 0
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length
}

const resultsPath = process.argv[2]
if (!resultsPath) {
  logError('No results file path provided.')
  process.exit(1)
}
if (!fs.existsSync(resultsPath)) {
  logError(`Results file not found at '${resultsPath}'`)
  process.exit(1)
}

const content = fs.readFileSync(resultsPath, 'utf8')
const results = JSON.parse(content)

const successfulIterations = results.iterations.filter((iter) => iter.status === 'SUCCESS')
if (successfulIterations.length === 0) {
  logError('No successful test iterations found to analyze.')
  process.exit(1)
}

logTitle('Per-Iteration Details')

results.iterations.forEach((iteration, index) => {
  console.log(`\n${C_BLUE}--- Iteration ${index + 1} ---${C_RESET}`)
  if (iteration.status !== 'SUCCESS') {
    console.log(`Status: ${C_RED}${iteration.status}${C_RESET}`)
    return
  }
  console.log(`Status: ${iteration.status}`)

  const measures = iteration.measures
  const avgFps = getAverageFPSUsage(measures)
  const avgRam = getAverageRAMUsage(measures)
  const avgCpu = getAverageCpuUsage(measures)

  const allFpsValues = measures.map((m) => m.fps).filter(Boolean)
  const minFps = allFpsValues.length > 0 ? Math.min(...allFpsValues) : 'N/A'
  const maxRam = Math.max(...measures.map((m) => m.ram).filter(Boolean))

  console.log(`  - FPS (Avg/Min):        ${toInt(avgFps)} / ${toInt(minFps)}`)
  console.log(`  - RAM (Avg/Max):        ${toInt(avgRam)} MB / ${toInt(maxRam)} MB`)
  console.log(`  - CPU (Total Avg):      ${toInt(avgCpu)} %`)
})

logTitle('Aggregated Performance Summary')

const score = getScore(averageTestCaseResult(results))
logMetric('Overall Score', `${C_GREEN}${score.toFixed(2)} / 100${C_RESET}`)
logMetric('Successful Iterations', `${successfulIterations.length} / ${results.iterations.length}`)

logTitle('Averaged Metrics (across all successful runs)')
const avgAllFps = average(successfulIterations.map((iter) => getAverageFPSUsage(iter.measures)))
const avgAllRam = average(successfulIterations.map((iter) => getAverageRAMUsage(iter.measures)))
const avgAllCpu = average(successfulIterations.map((iter) => getAverageCpuUsage(iter.measures)))

logMetric('Average FPS', `${toInt(avgAllFps)}`)
logMetric('Average RAM Usage', `${toInt(avgAllRam)} MB`)
logMetric('Average Total CPU', `${toInt(avgAllCpu)} %`)

logTitle('Average CPU Usage Per Thread')
THREADS_TO_MONITOR.forEach((threadName) => {
  const threadCpuValues = successfulIterations.map((iteration) => {
    const perProcessUsage = getAverageCpuUsagePerProcess(iteration.measures)
    const threadInfo = perProcessUsage.find((p) => p.processName === threadName)
    return threadInfo ? threadInfo.cpuUsage : 0
  })

  const avgThreadCpu = average(threadCpuValues)
  const color = threadName.includes('js') ? C_YELLOW : ''
  logMetric(threadName, `${color}${avgThreadCpu.toFixed(2)} %${C_RESET}`)
})

if (results.status !== 'SUCCESS') {
  logError(`Overall test status was '${results.status}'. Failing the build.`)
  process.exit(1)
}
