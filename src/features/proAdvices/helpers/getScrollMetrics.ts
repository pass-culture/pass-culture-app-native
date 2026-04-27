type ScrollMetrics = {
  contentHeight: number
  offsetY: number
  viewportHeight: number
}

type ScrollTargetMetrics = {
  clientHeight: number
  scrollHeight: number
  scrollTop: number
}

type ScrollEventLike = {
  nativeEvent: {
    contentOffset?: {
      y: number
    }
    contentSize?: {
      height: number
    }
    layoutMeasurement?: {
      height: number
    }
    target?: unknown
  }
}

const isScrollTargetMetrics = (target: unknown): target is ScrollTargetMetrics => {
  if (typeof target !== 'object' || target === null) {
    return false
  }

  return (
    'scrollHeight' in target &&
    typeof target.scrollHeight === 'number' &&
    'scrollTop' in target &&
    typeof target.scrollTop === 'number' &&
    'clientHeight' in target &&
    typeof target.clientHeight === 'number'
  )
}

export const getScrollMetrics = ({ nativeEvent }: ScrollEventLike): ScrollMetrics | null => {
  const { contentOffset, contentSize, layoutMeasurement } = nativeEvent

  if (contentOffset && contentSize && layoutMeasurement) {
    return {
      contentHeight: contentSize.height,
      offsetY: contentOffset.y,
      viewportHeight: layoutMeasurement.height,
    }
  }

  const { target } = nativeEvent

  if (isScrollTargetMetrics(target)) {
    return {
      contentHeight: target.scrollHeight,
      offsetY: target.scrollTop,
      viewportHeight: target.clientHeight,
    }
  }

  return null
}
