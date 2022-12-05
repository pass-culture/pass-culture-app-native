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
    beginningDatetime  | endingDatetime               | expectedResult
    ${mockedTodayDate} | ${undefined}                 | ${{ beginningDatetime: mockedToday, endingDatetime: undefined }}
    ${mockedTodayDate} | ${new Date(mockedNextMonth)} | ${{ beginningDatetime: mockedToday, endingDatetime: mockedNextMonth }}
    ${undefined}       | ${new Date(mockedNextMonth)} | ${{ beginningDatetime: undefined, endingDatetime: mockedNextMonth }}
  `(
    'should return $expectedResult when beginningDatetime: $beginningDatetime and endingDatetime: $endingDatetime',
    ({ beginningDatetime, endingDatetime, expectedResult }) => {
      const result = computeBeginningAndEndingDatetime({
        beginningDatetime,
        endingDatetime,
      })
      expect(result).toMatchObject(expectedResult)
    }
  )

  it('should return weekend datetimes when upcomingWeekendEvent is true and we are on a working day', () => {
    const result = computeBeginningAndEndingDatetime({
      upcomingWeekendEvent: true,
    })
    expect(result).toMatchObject({
      beginningDatetime: mockedNextFriday3pm,
      endingDatetime: mockedNextSunday,
    })
  })

  it('should return now datetime as beginningDatetime when upcomingWeekendEvent is true and we are in weekend', () => {
    mockdate.set(new Date('2022-12-02T15:00+00:00'))

    const result = computeBeginningAndEndingDatetime({ upcomingWeekendEvent: true })

    expect(result).toMatchObject({
      beginningDatetime: '2022-12-02T15:00+00:00',
      endingDatetime: mockedNextSunday,
    })

    mockdate.set(new Date(mockedToday))
  })

  it('should return now and two days later when eventDuringNextXDays is 2', () => {
    const result = computeBeginningAndEndingDatetime({
      eventDuringNextXDays: 2,
    })
    expect(result).toMatchObject({
      beginningDatetime: mockedToday,
      endingDatetime: mockedInTwoDays,
    })
  })

  it('should return now and this Sunday when currentWeekEvent is true', () => {
    const result = computeBeginningAndEndingDatetime({
      currentWeekEvent: true,
    })
    expect(result).toMatchObject({
      beginningDatetime: mockedToday,
      endingDatetime: mockedNextSunday,
    })
  })

  it.each`
    beginningDatetime  | endingDatetime               | upcomingWeekendEvent | eventDuringNextXDays | currentWeekEvent | expectedResult
    ${undefined}       | ${undefined}                 | ${false}             | ${2}                 | ${true}          | ${{ beginningDatetime: mockedToday, endingDatetime: mockedInTwoDays }}
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
      const result = computeBeginningAndEndingDatetime({
        beginningDatetime,
        endingDatetime,
        upcomingWeekendEvent,
        eventDuringNextXDays,
        currentWeekEvent,
      })
      expect(result).toMatchObject(expectedResult)
    }
  )
})
