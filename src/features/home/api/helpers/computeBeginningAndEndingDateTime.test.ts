import mockdate from 'mockdate'

import { computeBeginningAndEndingDateTime } from 'features/home/api/helpers/computeBeginningAndEndingDateTime'

const mockedToday = '2022-11-30T00:00+00:00'
mockdate.set(new Date(mockedToday))

const mockedTodayDate = new Date()
const mockedInTwoDays = '2022-12-02T00:00+00:00'
const mockedNextSunday = '2022-12-04T23:59+00:00'
const mockedNextMonth = '2022-12-30T00:00+00:00'
describe('computeBeginningAndEndingDateTime', () => {
  it.each`
    beginningDateTime  | endingDateTime               | eventDuringNextXDays | currentNextWeek | expectedResult
    ${mockedTodayDate} | ${undefined}                 | ${2}                 | ${false}        | ${{ beginningDateTime: mockedToday, endingDateTime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${2}                 | ${false}        | ${{ beginningDateTime: mockedToday, endingDateTime: mockedNextMonth }}
    ${undefined}       | ${new Date(mockedNextMonth)} | ${2}                 | ${false}        | ${{ beginningDateTime: undefined, endingDateTime: mockedNextMonth }}
    ${undefined}       | ${undefined}                 | ${2}                 | ${false}        | ${{ beginningDateTime: mockedToday, endingDateTime: mockedInTwoDays }}
    ${undefined}       | ${undefined}                 | ${undefined}         | ${true}         | ${{ beginningDateTime: mockedToday, endingDateTime: mockedNextSunday }}
    ${undefined}       | ${undefined}                 | ${2}                 | ${true}         | ${{ beginningDateTime: mockedToday, endingDateTime: mockedInTwoDays }}
    ${mockedTodayDate} | ${undefined}                 | ${2}                 | ${true}         | ${{ beginningDateTime: mockedToday, endingDateTime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${2}                 | ${true}         | ${{ beginningDateTime: mockedToday, endingDateTime: mockedNextMonth }}
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
