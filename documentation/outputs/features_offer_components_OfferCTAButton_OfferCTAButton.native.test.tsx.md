OfferCTAButton
 When booking API response is success
- should directly book and redirect to the offer when pressing button to book the offer if offer isn't Event
- should open when pressing button to book the offer if offer is Event
- should log BookingConfirmation when pressing button to book the offer
- should not display an error message when pressing button to book the offer


 When booking API response is error
- should not direclty redirect to the offer when pressing button to book the offer
- should not log BookingConfirmation when pressing button to book the offer


 When offer is digital and free and not already booked
- should display an error message when pressing button to book the offer


 and is Event
- should not open bookings details modal when pressing offer access button


 When offer is digital and free and already booked
- should directly redirect to the offer when pressing offer access button


 When there is a stored free offer id
- should reset free offer id and show modal when screen is focused


 <OfferCTAButton />
- should open booking modal when login after booking attempt
- should display authentication modal when clicking on "Réserver l’offre"
- should log analytics when display authentication modal
- should display reservation impossible when user has already booked the offer

