import mockdate from 'mockdate'

import { computeBeginningAndEndingDatetime } from 'features/home/api/helpers/computeBeginningAndEndingDateTime'

const mockedToday = '2022-11-30T00:00+00:00'
mockdate.set(new Date(mockedToday))

const mockedTodayDate = new Date()
const mockedInTwoDays = '2022-12-02T00:00+00:00'
const mockedNextFriday3pm = '2022-12-02T14:00+00:00'
const mockedNextSunday = '2022-12-04T23:59+00:00'
const mockedNextMonth = '2022-12-30T00:00+00:00'
describe('computeBeginningAndEndingDatetime', () => {
  it.each`
    beginningDatetime  | endingDatetime               | upcomingWeekendEvent | eventDuringNextXDays | currentWeekEvent | expectedResult
    ${mockedTodayDate} | ${undefined}                 | ${false}             | ${2}                 | ${false}         | ${{ beginningDatetime: mockedToday, endingDatetime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${false}             | ${2}                 | ${false}         | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextMonth }}
    ${undefined}       | ${new Date(mockedNextMonth)} | ${false}             | ${2}                 | ${false}         | ${{ beginningDatetime: undefined, endingDatetime: mockedNextMonth }}
    ${undefined}       | ${undefined}                 | ${false}             | ${2}                 | ${false}         | ${{ beginningDatetime: mockedToday, endingDatetime: mockedInTwoDays }}
    ${undefined}       | ${undefined}                 | ${false}             | ${undefined}         | ${true}          | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextSunday }}
    ${undefined}       | ${undefined}                 | ${false}             | ${2}                 | ${true}          | ${{ beginningDatetime: mockedToday, endingDatetime: mockedInTwoDays }}
    ${undefined}       | ${undefined}                 | ${true}              | ${undefined}         | ${false}         | ${{ beginningDatetime: mockedNextFriday3pm, endingDatetime: mockedNextSunday }}
    ${mockedTodayDate} | ${undefined}                 | ${true}              | ${2}                 | ${true}          | ${{ beginningDatetime: mockedToday, endingDatetime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${true}              | ${2}                 | ${true}          | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextMonth }}
  `(
    'should return $expectedResult when beginningDatetime: $beginningDatetime, endingDatetime: $endingDatetime, upcomingWeekendEvent: $upcomingWeekendEvent, eventDuringNextXDays: $eventDuringNextXDays, currentWeekEvent: $currentWeekEvent',
    ({
      beginningDatetime,
      endingDatetime,
      upcomingWeekendEvent,
      eventDuringNextXDays,
      currentWeekEvent,
      expectedResult,
    }) => {
      const result = computeBeginningAndEndingDatetime(
        beginningDatetime,
        endingDatetime,
        upcomingWeekendEvent,
        eventDuringNextXDays,
        currentWeekEvent
      )
      expect(result).toMatchObject(expectedResult)
    }
  )
  it('should return now datetime as beginningDatetime when upcomingWeekendEvent is true and we are in weekend', () => {
    mockdate.set(new Date('2022-12-02T15:00+00:00'))

    const result = computeBeginningAndEndingDatetime(
      undefined,
      undefined,
      true,
      undefined,
      undefined
    )

    expect(result).toMatchObject({
      beginningDatetime: '2022-12-02T15:00+00:00',
      endingDatetime: mockedNextSunday,
    })

    mockdate.set(new Date(mockedToday))
  })
})
