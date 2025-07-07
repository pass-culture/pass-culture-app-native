const fs = require('fs')
// Import functions for BOTH per-iteration stats AND the final aggregated report
const {
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
  averageTestCaseResult,
  getScore,
  getFpsStats,
  getRamStats,
  getCpuStats,
  getThreadsStats,
} = require('@perf-profiler/reporter')

// --- Configuration ---
const TOP_N_THREADS = 5

// --- ANSI color codes for logging ---
const C_BLUE = '\x1b[1;34m'
const C_GREEN = '\x1b[1;32m'
const C_RED = '\x1b[1;31m'
const C_YELLOW = '\x1b[1;33m'
const C_RESET = '\x1b[0m'
const C_DIM = '\x1b[2m'

// --- Helper Functions ---
const logTitle = (title) => console.log(`\n${C_BLUE}===== ${title} =====${C_RESET}`)
const logMetric = (name, value) => console.log(`  - ${name.padEnd(25, ' ')}${value}`)
const toInt = (num) => Math.floor(num || 0)

// --- Script Entry Point ---
const resultsPath = process.argv[2]
if (!resultsPath) {
  console.error(`${C_RED}ERROR: No results file path provided.${C_RESET}`)
  process.exit(1)
}

if (!fs.existsSync(resultsPath)) {
  console.error(`${C_RED}ERROR: Results file not found at '${resultsPath}'${C_RESET}`)
  process.exit(1)
}

const content = fs.readFileSync(resultsPath, 'utf8')
let results
try {
  results = JSON.parse(content)
} catch (error) {
  console.error(`${C_RED}ERROR: Failed to parse JSON from '${resultsPath}'${C_RESET}`, error)
  process.exit(1)
}

// =============================================================================
// PART 1: LOG DETAILS FOR EACH INDIVIDUAL ITERATION
// =============================================================================
logTitle('Per-Iteration Details')

results.iterations.forEach((iteration, index) => {
  console.log(`\n${C_BLUE}--- Iteration ${index + 1} ---${C_RESET}`)

  if (iteration.status !== 'SUCCESS') {
    console.log(`Status: ${C_RED}${iteration.status}${C_RESET}`)
    console.log('  Test failed, skipping metrics.')
    return
  }
  console.log(`Status: ${iteration.status}`)

  const measures = iteration.measures
  const avgFps = getAverageFPSUsage(measures)
  const avgRam = getAverageRAMUsage(measures)
  const avgCpu = getAverageCpuUsage(measures)

  // Manually calculate Min FPS from the raw measures
  const allFpsValues = measures.map((m) => m.fps).filter((fps) => fps !== null && fps !== undefined)
  const minFps = allFpsValues.length > 0 ? Math.min(...allFpsValues) : 'N/A'

  // Manually calculate Max RAM from the raw measures
  const allRamValues = measures.map((m) => m.ram).filter((ram) => ram !== null && ram !== undefined)
  const maxRam = allRamValues.length > 0 ? Math.max(...allRamValues) : 'N/A'

  console.log(`  - FPS (Avg/Min):      ${toInt(avgFps)} / ${toInt(minFps)}`)
  console.log(`  - RAM (Avg/Max):      ${toInt(avgRam)} MB / ${toInt(maxRam)} MB`)
  console.log(`  - CPU (Total Avg):      ${toInt(avgCpu)} %`)
})

// =============================================================================
// PART 2: LOG THE FINAL, AGGREGATED SUMMARY REPORT
// =============================================================================
const report = averageTestCaseResult(results)
const averageData = report.average

if (!averageData) {
  console.error(
    `\n${C_RED}ERROR: No successful test iterations found to generate a final summary.${C_RESET}`
  )
  process.exit(1)
}

logTitle('Aggregated Performance Summary')

const score = getScore(report)
logMetric('Overall Score', `${C_GREEN}${score.toFixed(2)} / 100${C_RESET}`)
logMetric('Successful Iterations', `${report.iterations.length} / ${results.iterations.length}`)

logTitle('FPS (UI Smoothness)')
const fpsStats = getFpsStats(averageData)
logMetric('Average FPS', `${toInt(fpsStats.average)} FPS`)
logMetric('Min FPS (UI Stutter)', `${C_YELLOW}${toInt(fpsStats.min)} FPS${C_RESET}`)

logTitle('RAM (Memory Usage)')
const ramStats = getRamStats(averageData)
logMetric('Average RAM Usage', `${toInt(ramStats.average)} MB`)
logMetric('Max RAM Usage', `${C_YELLOW}${toInt(ramStats.max)} MB${C_RESET}`)

logTitle('CPU Usage (Total)')
const cpuStats = getCpuStats(averageData)
logMetric('Average CPU Usage', `${toInt(cpuStats.average)} %`)
logMetric('Max CPU Usage', `${C_YELLOW}${toInt(cpuStats.max)} %${C_RESET}`)

logTitle(`CPU Usage (Top ${TOP_N_THREADS} Threads)`)
const threads = getThreadsStats(averageData)
  .sort((a, b) => b.averageCpuUsage - a.averageCpuUsage)
  .slice(0, TOP_N_THREADS)

threads.forEach((thread) => {
  logMetric(thread.name, `${toInt(thread.averageCpuUsage)} %`)
})

// =============================================================================
// FINAL VERDICT
// =============================================================================
if (report.status !== 'SUCCESS') {
  console.error(
    `\n${C_RED}[FAIL] Overall test status was '${report.status}'. Failing the build.${C_RESET}`
  )
  process.exit(1)
}
