import { formatDuration } from 'features/offerv2/helpers/formatDuration/formatDuration'

describe('formatDuration', () => {
  it('should format duration with a number of hours exactly', () => {
    expect(formatDuration(120)).toEqual('2h')
  })

  it('should format duration with only minutes which represent less than an hour', () => {
    expect(formatDuration(45)).toEqual('45 minutes')
  })

  it('should format duration with one hour exactly', () => {
    expect(formatDuration(60)).toEqual('1h')
  })

  it('should format duration with hours and minutes', () => {
    expect(formatDuration(75)).toEqual('1h15')
  })

  it('should format duration with zero duration', () => {
    expect(formatDuration(0)).toEqual(undefined)
  })
})
