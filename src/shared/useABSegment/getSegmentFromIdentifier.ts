import { SegmentResult } from 'shared/useABSegment/useABSegment'

export function getSegmentFromIdentifier(id?: number | string): SegmentResult {
  let segmentKey: number
  if (!id) return 'B'

  if (typeof id === 'number') {
    segmentKey = id
  } else {
    segmentKey = id.charCodeAt(id.length - 1)
  }

  return segmentKey % 2 === 0 ? 'A' : 'B'
}
