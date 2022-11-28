import mockdate from 'mockdate'

import { computeBeginningAndEndingDatetime } from 'features/home/api/helpers/computeBeginningAndEndingDateTime'

const mockedToday = '2022-11-30T00:00+00:00'
mockdate.set(new Date(mockedToday))

const mockedTodayDate = new Date()
const mockedInTwoDays = '2022-12-02T00:00+00:00'
const mockedNextSunday = '2022-12-04T23:59+00:00'
const mockedNextMonth = '2022-12-30T00:00+00:00'
describe('computeBeginningAndEndingDatetime', () => {
  it.each`
    beginningDatetime  | endingDatetime               | eventDuringNextXDays | currentNextWeek | expectedResult
    ${mockedTodayDate} | ${undefined}                 | ${2}                 | ${false}        | ${{ beginningDatetime: mockedToday, endingDatetime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${2}                 | ${false}        | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextMonth }}
    ${undefined}       | ${new Date(mockedNextMonth)} | ${2}                 | ${false}        | ${{ beginningDatetime: undefined, endingDatetime: mockedNextMonth }}
    ${undefined}       | ${undefined}                 | ${2}                 | ${false}        | ${{ beginningDatetime: mockedToday, endingDatetime: mockedInTwoDays }}
    ${undefined}       | ${undefined}                 | ${undefined}         | ${true}         | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextSunday }}
    ${undefined}       | ${undefined}                 | ${2}                 | ${true}         | ${{ beginningDatetime: mockedToday, endingDatetime: mockedInTwoDays }}
    ${mockedTodayDate} | ${undefined}                 | ${2}                 | ${true}         | ${{ beginningDatetime: mockedToday, endingDatetime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${2}                 | ${true}         | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextMonth }}
  `(
    'should return $expectedResult when beginningDatetime: $beginningDatetime, endingDatetime: $endingDatetime, eventDuringNextXDays: $eventDuringNextXDays, currentNextWeek: $currentNextWeek',
    ({
      beginningDatetime,
      endingDatetime,
      eventDuringNextXDays,
      currentNextWeek,
      expectedResult,
    }) => {
      const result = computeBeginningAndEndingDatetime(
        beginningDatetime,
        endingDatetime,
        eventDuringNextXDays,
        currentNextWeek
      )
      expect(result).toMatchObject(expectedResult)
    }
  )
})
