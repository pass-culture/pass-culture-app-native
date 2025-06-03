GenericHome
 With not displayed skeleton by default
- should display skeleton
- should display real content
- should display offline page when not connected


 Home N-1
- should not display video in header if videoCarouselModule is the first module given
- should not display video in header if videoCarouselModule is not the first module given


 Home
- should display video in header if videoCarouselModule is the first module given
- should not display video in header if videoCarouselModule is not the first module given


 VideoCarouselModule


 GenericHome


 GenericHome page - Analytics
- [OfferView] should set tracking function at start
- [OfferView] should set page info in store
- [OfferView] should log offer view when blur
- should trigger logEvent "AllModulesSeen" when reaching the end
- should trigger batch logEvent "has_seen_all_the_homepage" when reaching the end on a Home
- should trigger batch logEvent "has_seen_all_the_homepage" when reaching the end on Thematic Home
- should trigger logEvent "AllModulesSeen" only once
- should display spinner when end is reached

