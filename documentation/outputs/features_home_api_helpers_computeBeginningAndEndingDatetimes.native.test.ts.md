computeBeginningAndEndingDatetimes
 computeBeginningAndEndingDatetime
- should return weekend datetimes when upcomingWeekendEvent is true and we are on a working day
- should return now datetime as beginningDatetime when upcomingWeekendEvent is true and we are in weekend
- should return now and two days later when eventDuringNextXDays is 2
- should return now and this Sunday when currentWeekEvent is true

