Bookings
 Bookings
- should render correctly
- should always execute the query (in cache or in network)
- should display the empty bookings dedicated view
- should display the 2 tabs "Terminées" and "En cours"
- should display list of bookings by default
- should change on "Terminées" tab and have one ended booking
- should call updateReactions when switching from COMPLETED tab
- should update reactions for ended bookings without user reaction
- should display a pastille when there are bookings without user reaction if wipReactionFeature FF activated
- should not display a pastille when there are bookings without user reaction if wipReactionFeature FF deactivated
- should not display a pastille when there are not bookings without user reaction if wipReactionFeature FF activated

