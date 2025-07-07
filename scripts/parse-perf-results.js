const fs = require('fs')
const {
  averageIterations,
  getScore,
  getFpsStats,
  getRamStats,
  getCpuStats,
  getThreadsStats,
  getStandardDeviationFPS,
  getStandardDeviationCPU,
  getAverageCpuUsagePerProcess,
  sanitizeProcessName,
  canComputeHighCpuUsage,
  averageHighCpuUsage,
} = require('@perf-profiler/reporter')

// --- Configuration ---
// Show the top N CPU consuming threads to avoid overly verbose logs
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

// --- Main Logic ---

// Step 1: Create a single, averaged result from all successful test iterations
const successfulIterations = results.iterations.filter((iter) => iter.status === 'SUCCESS')
if (successfulIterations.length === 0) {
  console.error(`${C_RED}ERROR: No successful test iterations found to analyze.${C_RESET}`)
  process.exit(1)
}
const averagedResult = averageIterations(successfulIterations)

// Step 2: Generate and display the report sections
logTitle('Overall Performance Summary')

const score = getScore(averagedResult)
logMetric('Overall Score', `${C_GREEN}${score.toFixed(2)} / 100${C_RESET}`)
logMetric('Successful Iterations', `${successfulIterations.length} / ${results.iterations.length}`)

if (canComputeHighCpuUsage(averagedResult)) {
  const highCpu = averageHighCpuUsage(averagedResult)
  logMetric('Time with High CPU (>90%)', `${C_YELLOW}${highCpu.toFixed(2)}% of the time${C_RESET}`)
}

logTitle('FPS (UI Smoothness)')
const fpsStats = getFpsStats(averagedResult)
const fpsStdDev = getStandardDeviationFPS(averagedResult)
logMetric('Average FPS', `${toInt(fpsStats.average)} FPS`)
logMetric('Min FPS (UI Stutter)', `${C_YELLOW}${toInt(fpsStats.min)} FPS${C_RESET}`)
logMetric('Std Deviation (Jankiness)', `${toInt(fpsStdDev)}`)
console.log(`${C_DIM}  (Lower is smoother)${C_RESET}`)

logTitle('RAM (Memory Usage)')
const ramStats = getRamStats(averagedResult)
logMetric('Average RAM Usage', `${toInt(ramStats.average)} MB`)
logMetric('Max RAM Usage', `${C_YELLOW}${toInt(ramStats.max)} MB${C_RESET}`)

logTitle('CPU Usage (Total)')
const cpuStats = getCpuStats(averagedResult)
const cpuStdDev = getStandardDeviationCPU(averagedResult)
logMetric('Average CPU Usage', `${toInt(cpuStats.average)} %`)
logMetric('Max CPU Usage', `${C_YELLOW}${toInt(cpuStats.max)} %${C_RESET}`)
logMetric('Std Deviation (Stability)', `${toInt(cpuStdDev)}`)

logTitle('CPU Usage (Per Process)')
const perProcessCpu = getAverageCpuUsagePerProcess(averagedResult)
for (const processName in perProcessCpu) {
  logMetric(sanitizeProcessName(processName), `${toInt(perProcessCpu[processName])} %`)
}

logTitle(`CPU Usage (Top ${TOP_N_THREADS} Threads)`)
const threads = getThreadsStats(averagedResult)
  .sort((a, b) => b.averageCpuUsage - a.averageCpuUsage)
  .slice(0, TOP_N_THREADS)

threads.forEach((thread) => {
  logMetric(sanitizeProcessName(thread.name), `${toInt(thread.averageCpuUsage)} %`)
})

// --- Final Verdict ---
if (results.status !== 'SUCCESS') {
  console.error(
    `\n${C_RED}[FAIL] Overall test status was '${results.status}'. Failing the build.${C_RESET}`
  )
  process.exit(1)
}
