const fs = require('fs')
const {
  getAverageCpuUsage,
  getAverageFPSUsage,
  getAverageRAMUsage,
} = require('@perf-profiler/reporter')

// ANSI color codes for logging
const C_BLUE = '\x1b[1;34m'
const C_GREEN = '\x1b[1;32m'
const C_RED = '\x1b[1;31m'
const C_RESET = '\x1b[0m'

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
  console.error(`${C_RED}ERROR: Failed to parse JSON from '${resultsPath}'${C_RESET}`)
  console.error(error)
  process.exit(1)
}

console.log(`${C_BLUE}========== Performance Test Summary ==========${C_RESET}`)

const overallStatus = results.status
if (overallStatus !== 'SUCCESS') {
  console.log(
    `${C_RED}Test run reported a FAILURE status overall. Summary of iterations below.${C_RESET}`
  )
} else {
  console.log(`${C_GREEN}Test run reported a SUCCESS status overall.${C_RESET}`)
}

results.iterations.forEach((iteration, index) => {
  console.log(`\n${C_BLUE}--- Iteration ${index + 1} ---${C_RESET}`)
  const status = iteration.status
  const measures = iteration.measures

  if (status !== 'SUCCESS') {
    console.log(`Status: ${C_RED}${status}${C_RESET}`)
    console.log('  Test failed, skipping metrics.')
    return
  }

  console.log(`Status: ${status}`)

  const avgFps = getAverageFPSUsage(measures)
  const avgRam = getAverageRAMUsage(measures)
  const avgCpu = getAverageCpuUsage(measures)

  const allFpsValues = measures.map((m) => m.fps).filter((fps) => fps !== null && fps !== undefined)
  const minFps = allFpsValues.length > 0 ? Math.min(...allFpsValues) : 'N/A'

  const allRamValues = measures.map((m) => m.ram).filter((ram) => ram !== null && ram !== undefined)
  const maxRam = allRamValues.length > 0 ? Math.max(...allRamValues) : 'N/A'

  console.log(`  - FPS (Avg/Min):      ${Math.floor(avgFps)} / ${Math.floor(minFps)}`)
  console.log(`  - RAM (Avg/Max):      ${Math.floor(avgRam)} MB / ${Math.floor(maxRam)} MB`)

  // FIX: Treat avgCpu as a single number for the total average CPU usage.
  // The getAverageCpuUsage function in this library version does not return a per-thread breakdown.
  console.log(`  - CPU (Total Avg):      ${Math.floor(avgCpu)} %`)
})

console.log(`\n${C_BLUE}===========================================${C_RESET}`)

// Exit with a non-zero code if the overall test run failed to fail the CI job
if (overallStatus !== 'SUCCESS') {
  console.error(`${C_RED}[ERROR] Performance test suite did not pass. Failing the build.${C_RESET}`)
  process.exit(1)
}
