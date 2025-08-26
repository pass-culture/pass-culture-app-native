type Percent = `${number}%`

interface ThresholdConfig {
  value: number
}

const DEFAULT_CONTAINER_HEIGHT_FOR_PERCENTAGE_CALCULATION = 100

export function parseThreshold(
  threshold: Percent | number = 0,
  elementHeight?: number
): ThresholdConfig {
  if (typeof threshold === 'string' && threshold.endsWith('%')) {
    const percentage = parseFloat(threshold.slice(0, -1))

    // Use a default height for percentage calculation when element height is not available
    // This typically happens during initial render before layout measurement
    const height = elementHeight || DEFAULT_CONTAINER_HEIGHT_FOR_PERCENTAGE_CALCULATION

    const pixelValue = (percentage / 100) * height
    return {
      value: pixelValue,
    }
  }

  return {
    value: threshold as number,
  }
}
