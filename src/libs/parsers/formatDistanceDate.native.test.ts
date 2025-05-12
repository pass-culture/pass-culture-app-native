import { formatDistanceDate } from 'libs/parsers/formatDistanceDate'

describe('formatDistanceDate', () => {
  it('should return distance and date separated by • when both of its defined', () => {
    expect(formatDistanceDate('3 km', '12 mai')).toEqual('à 3 km • 12 mai')
  })

  it('should return only distance when defined and date undefined', () => {
    expect(formatDistanceDate('3 km', undefined)).toEqual('à 3 km')
  })

  it('should return only date when defined and distance undefined', () => {
    expect(formatDistanceDate(undefined, '12 mai')).toEqual('12 mai')
  })

  it('should return undefined when distance and date undefined', () => {
    expect(formatDistanceDate(undefined, undefined)).toBeUndefined()
  })

  it('should return only distance when defined and date is an empty string', () => {
    expect(formatDistanceDate('3 km', '')).toEqual('à 3 km')
  })

  it('should return only date when defined and distance is an empty string', () => {
    expect(formatDistanceDate('', '12 mai')).toEqual('12 mai')
  })

  it('should return an empty string when distance and date are empty string', () => {
    expect(formatDistanceDate('', '')).toEqual('')
  })
})
