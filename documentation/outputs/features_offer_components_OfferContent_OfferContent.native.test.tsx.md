OfferContent
 Header
- should display offer header
- should remove favorite when press on favorite
- should display snackbar when remove favorite fails


 Same category similar offers
- should display same category similar offers
- should trigger logSameCategoryPlaylistVerticalScroll when scrolling to the playlist
- should trigger only once time logSameCategoryPlaylistVerticalScroll when scrolling to the playlist
- should not trigger logSameCategoryPlaylistVerticalScroll when not scrolling to the playlist


 Other categories similar offers
- should display other categories similar offer
- should trigger logOtherCategoriesPlaylistVerticalScroll when scrolling to the playlist
- should trigger only once time logOtherCategoriesPlaylistVerticalScroll when scrolling to the playlist
- should not trigger logOtherCategoriesPlaylistVerticalScroll when not scrolling to the playlist


 Playlist list section


 Offer booking button
- should display "Réserver l’offre" button
- should log analytics when display authentication modal
- should trigger logEvent "ConsultAllOffer" when reaching the end
- should trigger logEvent "ConsultAllOffer" only once


 analytics
- should send logHasAddedOfferToFavorites event with correct params


 favorite button
- should display "Mettre en favori" button


 Offer footer


 Batch trigger
- should trigger has_seen_offer_for_survey event after 5 seconds
- should not trigger has_seen_offer_for_survey event before 5 seconds have elapsed
- should trigger has_seen_offer_for_survey event on scroll to bottom
- should not trigger has_seen_offer_for_survey event on scroll to middle
- should trigger has_seen_offer_for_survey event once on scroll to bottom and after 5 seconds


 with remote config activated
- should not appear if the offer is not a movie screening
- should show button
- should scroll to anchor


 with remote config deactivated
- should not display the button if the remote config flag is deactivated


 Chronicles section
- should not display chronicles section when there are no chronicles
- should display "Voir tous les avis" button
- should navigate to chronicles page when pressing "Voir tous les avis" button
- should navigate to chronicles page with anchor on the selected chronicle when pressing "Voir plus" button on a card
- should log consultChronicle when pressing "Voir plus" button


 movie screening access button
- should display social network section


 coming soon footer
- should render a footer offset when the coming soon footer has a height
- should not render a footer offset when the coming soon footer does not have a height


 <OfferContent />
- should navigate to offer preview screen when clicking on image offer
- should navigate to offer preview screen when clicking on placeholder image
- should animate on scroll
- should display mobile body on mobile
- should not display desktop body on mobile
- should display sticky booking button on mobile
- should not display nonadhesive booking button on mobile

