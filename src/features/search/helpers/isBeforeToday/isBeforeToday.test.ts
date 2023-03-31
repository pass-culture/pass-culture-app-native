import mockdate from 'mockdate'

import { isBeforeToday } from 'features/search/helpers/isBeforeToday/isBeforeToday'

mockdate.set(new Date('2022-07-14T00:00:00Z'))

describe('isBeforeToday', () => {
  it('should return false if later than today', () => {
    expect(isBeforeToday('2022', 6, '14')).toBeFalsy()
  })
  it('should return true if one year before', () => {
    expect(isBeforeToday('2021', 6, '14')).toBeTruthy()
  })
  it('should return true if one month before', () => {
    expect(isBeforeToday('2022', 5, '14')).toBeTruthy()
  })
  it('should return true if one day before', () => {
    expect(isBeforeToday('2022', 6, '12')).toBeTruthy()
  })
})
