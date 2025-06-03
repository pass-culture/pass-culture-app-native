getOpeningHoursStatus
 Venue is open


 Venue open soon


 Venue close soon
- should be in close-soon state


 Venue closes soon, but actually stays open (overnight event)
- should have "open until" text


 Venue is closed


 Venue is not on same timezone
- user is in paris and venue is in guadeloupe


 OpeningHoursStatusViewModel
- user is in guadeloupe and venue is in paris
- should handle 00:00 to 23:59 opening hours for all days

