import mockdate from 'mockdate'

import { computeBeginningAndEndingDateTime } from 'features/home/api/helpers/computeBeginningAndEndingDateTime'

mockdate.set(new Date('2022-11-30T00:00+00:00'))
describe('computeBeginningAndEndingDateTime', () => {
  const mockedTodayDate = new Date()

  it.each`
    beginningDateTime  | endingDateTime                        | eventDuringNextXDays | currentNextWeek | expectedResult
    ${mockedTodayDate} | ${undefined}                          | ${2}                 | ${false}        | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: undefined }}
    ${mockedTodayDate} | ${new Date('2022-12-30T00:00+00:00')} | ${2}                 | ${false}        | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-30T00:00+00:00' }}
    ${undefined}       | ${new Date('2022-12-30T00:00+00:00')} | ${2}                 | ${false}        | ${{ beginningDateTime: undefined, endingDateTime: '2022-12-30T00:00+00:00' }}
    ${undefined}       | ${undefined}                          | ${2}                 | ${false}        | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-02T00:00+00:00' }}
    ${undefined}       | ${undefined}                          | ${undefined}         | ${true}         | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-04T23:59+00:00' }}
    ${undefined}       | ${undefined}                          | ${2}                 | ${true}         | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-02T00:00+00:00' }}
    ${mockedTodayDate} | ${undefined}                          | ${2}                 | ${true}         | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: undefined }}
    ${mockedTodayDate} | ${new Date('2022-12-30T00:00+00:00')} | ${2}                 | ${true}         | ${{ beginningDateTime: '2022-11-30T00:00+00:00', endingDateTime: '2022-12-30T00:00+00:00' }}
  `(
    'should return $expectedResult when beginningDateTime: $beginningDateTime, endingDateTime: $endingDateTime, eventDuringNextXDays: $eventDuringNextXDays, currentNextWeek: $currentNextWeek',
    ({
      beginningDateTime,
      endingDateTime,
      eventDuringNextXDays,
      currentNextWeek,
      expectedResult,
    }) => {
      const result = computeBeginningAndEndingDateTime(
        beginningDateTime,
        endingDateTime,
        eventDuringNextXDays,
        currentNextWeek
      )
      expect(result).toMatchObject(expectedResult)
    }
  )
})
