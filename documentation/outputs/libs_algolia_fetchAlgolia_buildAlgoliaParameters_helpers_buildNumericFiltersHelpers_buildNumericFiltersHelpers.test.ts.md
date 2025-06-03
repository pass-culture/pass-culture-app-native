buildNumericFiltersHelpers
 buildOfferLast30DaysBookings
- should return an undefined offer last 30 days bookings predicate when not defined
- should return an undefined offer last 30 days bookings predicate when defined at 0
- should return an offer last 30 days bookings predicate when defined at a value > 0


 buildOfferPriceRangePredicate
- should return an offer price range predicate from 0 to 300 when price range, minimum and maximum prices not defined
- should return an offer price range predicate at 0 when offerIsFree is true
- should return an offer price range predicate with the minimum price when defined and the default maximum price
- should return an offer price range predicate with the maximum price when defined and the default minimum price
- should return an offer price range predicate with the maximum possible price when defined and the default minimum price
- should return an offer price range predicate with the price range when defined
- should return an offer price range predicate with the minimum and maximum prices when defined and price range not defined


 buildDatePredicate
- should return an undefined date predicate when date and time range not defined
- should return a date predicate with date and time range when defined
- should return a date predicate with date only when date defined and time range not defined
- should return a date predicate with time range only when time range defined and date not defined


 buildHomepageDatePredicate
- should return an undefined homepage date predicate when beginning and ending date not defined
- should return an homepage date predicate from beginning date when beginning date defined and ending date not defined
- should return an homepage date predicate with only beginning date when beginning date defined, ending date not defined and used from search
- should return an homepage date predicate with only ending date when ending date defined and beginning date not defined
- should return an homepage date predicate with a beginning and ending dates when beginning and ending dates defined


 buildTimeOnlyPredicate
- should return a time range in seconds


 buildDateAndTimePredicate
- should return a date and time predicate of the selected date and time range when date filter option is today
- should return a date and time predicate of the selected date and time range when date filter option is user pick
- should return a date and time predicate of the selected dates and time range when date filter option is current week
- should return a date and time predicate of the selected dates and time range when date filter option is current week-end


 buildDateOnlyPredicate
- should return a date predicate of the selected date when date filter option is today
- should return a date predicate of the selected dates when date filter option is current week
- should return a date predicate of the selected dates when date filter option is current week-end
- should return a date predicate of the selected date when date filter option is user pick


 getDatePredicate
- should return a date predicate from a beginning and ending dates

