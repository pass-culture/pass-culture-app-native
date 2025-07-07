const fs = require('fs')
// FIX: Import the new getSummary function instead of the old, separate ones
const { getSummary } = require('@perf-profiler/reporter')

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

  if (status !== 'SUCCESS') {
    console.log(`Status: ${C_RED}${status}${C_RESET}`)
    console.log('  Test failed, skipping metrics.')
    return
  }
  console.log(`Status: ${status}`)

  // FIX: Use the new getSummary function to get all stats in one object
  const summary = getSummary(iteration)

  // FIX: Access the calculated values directly from the summary object
  const avgFps = summary.average.fps
  const minFps = summary.min.fps
  const avgRam = summary.average.ram
  const maxRam = summary.max.ram
  // The CPU usage object is nested
  const avgCpuUI = summary.average.cpu.perName['UI Thread'] || 0
  const avgCpuJS = summary.average.cpu.perName['mqt_js'] || 0 // Common name for JS thread in RN

  console.log(`  - FPS (Avg/Min):      ${Math.floor(avgFps)} / ${Math.floor(minFps)}`)
  console.log(`  - RAM (Avg/Max):      ${Math.floor(avgRam)} MB / ${Math.floor(maxRam)} MB`)
  console.log(`  - CPU UI Thread (Avg):  ${Math.floor(avgCpuUI)} %`)
  console.log(`  - CPU JS Thread (Avg):  ${Math.floor(avgCpuJS)} %`)
})

console.log(`\n${C_BLUE}===========================================${C_RESET}`)

// Exit with a non-zero code if the overall test run failed to fail the CI job
if (overallStatus !== 'SUCCESS') {
  console.error(`${C_RED}[ERROR] Performance test suite did not pass. Failing the build.${C_RESET}`)
  process.exit(1)
}
