formatDates
 groupByYearAndMonth
- should group an array of decomposed dates by year and month
- should return an empty object for an empty array


 joinArrayElement
- should return the single element when given an array with only one element
- should return two elements joined with "et"
- should return three or more elements joined with commas and "et"
- should return undefined when the array is empty


 formatGroupedDates
- should correctly format grouped dates with single day
- should correctly format grouped dates with multiple days
- should return empty arrays when given an empty object


 getFormattedDates
- should return undefined when undefined or empty array is given
- should return only future dates
- should return undefined when the array dates are invalid
- should return a formatted date when array contains only one unique date
- should return a formatted string of 1 date when array contains two similar dates
- should return a formatted string date of two dates with the same month
- should return a formatted string date of 1 date when array contains two same dates with different hour
- should return a formatted string date of 2 dates with the same day, same month but different years
- should return a formatted string date including three dates with different months
- should return a formatted string date including three dates, with two dates of different month in the same year and one date of different month and year
- should return a formatted string date including three dates, with two dates of the same month and year and one date of different month in a different year
- should return a formatted string date including 4 dates in the same year, with 2 dates of different months and 2 dates in the same month
- should return a formatted string date including 4 dates, with 1 date of a different month and 3 dates in the same month
- should return a formatted string date including 4 dates, with 1 date of a different month and year and 3 dates in the same month and year
- should return a formatted string date including 5 dates within a period range


 formatDates
- should return undefined when undefined is given
- should return undefined when empty array is given
- should return undefined when given dates are past
- should return "Dès le" when given dates are future and different


 formatToFrenchDate


 formatToFrenchDateWithoutYear


 formatDatePeriod
- should return a formatted string date for a period of one day
- should return a formatted string date for a period of multiple days in the same month and year
- should return a formatted string date for a period of multiple days in different months of the same year
- should return a formatted string date for a period of multiple days in different years


 getUniqueSortedTimestamps


 formatDateToISOStringWithoutTime() - Brazil/East


 formatDateToISOStringWithoutTime() - Europe/London


 formatToCompleteFrenchDate()


 capitalizeFirstLetter
- should capitalize the first letter of a string
- should handle an empty string
- should handle a non-string input
- should handle a single-character string


 formatReleaseDate
- should format date properly when given date is today
- should format date properly when given date is before today
- should format date properly when given date is after today


 formatPublicationDate


 getTimeStampInMillis
- should return an array of number multiplied each by 1000

