BookingOfferModalFooter
 when current step is date selection
- should display "Valider la date"
- should not change step when date not selected
- should change step to hour selection when date selected
- should reset potential previous hour when date selected


 when current step is hour selection
- should display "Valider lʼhoraire"
- should not change step when hour not selected
- should change step to price selection when hour selected and has several prices
- should reset stock selection when hour selected and has several prices
- should change step to quantity selection when hour selected, has not several prices and offer is duo
- should change step to confirmation when hour selected, has not several prices and offer is not duo


 when current step is price selection
- should display "Valider le prix"
- should not change step when stock not selected
- should change step to quantity selection when stock selected and offer is duo
- should change step to confirmation when stock selected and offer is not duo


 when current step is quantity selection
- should display "Finaliser ma réservation"
- should not change step when quantity not selected
- should change step to confirmation when quantity selected


 when current step is confirmation
- should not display footer


 tracking
- should log hasChosenPrice event when user submits a price
- should log hasChosenTime event when user submits an hour
- should log hasClickedDuoStep event when user submits solo or duo option


 BookingOfferModalFooter

