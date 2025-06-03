Venue
 CTA
- should not display CTA if venueTypeCode is Movie
- should display CTA if venueTypeCode is not Movie and venueOffers hits have length
- should display CTA if venueTypeCode is not Movie and gtlPlaylists have length


 analytics
- should not log consult venue when URL has unexpected "from" param
- should not log consult venue when URL has not "from" param


 remote config flag is deactivated
- should not display the button if the remote config flag is deactivated


 movie screening access button
- should show button by default
- should not show button when in View
- should scroll to anchor


 <Venue />
- should match snapshot
- should match snapshot with practical information
- should match snapshot with headline offer
- should display default background image when no banner for venue

