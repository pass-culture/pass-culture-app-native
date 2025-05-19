import { MIN_WIDTH_DISTANCE_DISPLAYED, formatDistanceDate } from 'libs/parsers/formatDistanceDate'

describe('formatDistanceDate', () => {
  it('should return distance and date separated by • when both of its defined and width >= min width displayed', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, '3 km', '12 mai')).toEqual(
      'à 3 km • 12 mai'
    )
  })

  it('should return only date when distance and date defined and width < min width displayed', () => {
    expect(formatDistanceDate(100, '3 km', '12 mai')).toEqual('12 mai')
  })

  it('should return only distance when defined and date undefined and width >= min width displayed', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, '3 km', undefined)).toEqual('à 3 km')
  })

  it('should return undefined when distance defined and date undefined and width < min width displayed', () => {
    expect(formatDistanceDate(100, '3 km', undefined)).toEqual(undefined)
  })

  it('should return only date when defined and distance undefined', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, undefined, '12 mai')).toEqual('12 mai')
  })

  it('should return undefined when distance and date undefined', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, undefined, undefined)).toEqual(
      undefined
    )
  })

  it('should return only distance when defined and date is an empty string and width >= min width displayed', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, '3 km', '')).toEqual('à 3 km')
  })

  it('should an empty string when only distance defined and date is an empty string and width < min width displayed', () => {
    expect(formatDistanceDate(100, '3 km', '')).toEqual('')
  })

  it('should return only date when defined and distance is an empty string', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, '', '12 mai')).toEqual('12 mai')
  })

  it('should return an empty string when distance and date are empty string', () => {
    expect(formatDistanceDate(MIN_WIDTH_DISTANCE_DISPLAYED, '', '')).toEqual('')
  })
})
