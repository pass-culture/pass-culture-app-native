import mockdate from 'mockdate'

import { computeBeginningAndEndingDateTime } from 'features/home/api/helpers/computeBeginningAndEndingDateTime'

mockdate.set(new Date('2022-11-30T00:00+00:00'))
describe('computeBeginningAndEndingDateTime', () => {
  const mockedTodayDate = new Date()

  it.each`
    beginningDateTime  | endingDateTime                        | eventDuringNextXDays | expectedResult
    ${mockedTodayDate} | ${undefined}                          | ${2}                 | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: undefined }}
    ${mockedTodayDate} | ${new Date('2022-12-30T00:00+00:00')} | ${2}                 | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-30T00:00+00:00' }}
    ${undefined}       | ${new Date('2022-12-30T00:00+00:00')} | ${2}                 | ${{ beginningDateTime: undefined, endingDateTime: '2022-12-30T00:00+00:00' }}
    ${undefined}       | ${undefined}                          | ${2}                 | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-02T00:00+00:00' }}
  `(
    'should return the correct beginningDateTime: $beginningDateTime and endingDateTime: $endingDateTime depending on the contentful data provided',
    ({ beginningDateTime, endingDateTime, eventDuringNextXDays, expectedResult }) => {
      const result = computeBeginningAndEndingDateTime(
        beginningDateTime,
        endingDateTime,
        eventDuringNextXDays
      )
      expect(result).toMatchObject(expectedResult)
    }
  )
})
