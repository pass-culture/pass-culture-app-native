errors
 MonitoringError
- should call eventMonitoring.captureException() on new MonitoringError instance
- should rename MonitoringError to RenamedError
- should pass captureContext to MonitoringError as a 2nd argument
- should pass captureContext to RenamedError as a last argument
- should captureMessage as info on new MonitoringError instance when log type is info
- should not captureMessage on new MonitoringError instance when log type is ignored


 OfferNotFoundError
- should return message with offer id when it defined
- should return message without offer id when it undefined


 VenueNotFoundError
- should return message with offer id when it defined
- should return message without offer id when it undefined

