BookingDetails
 with initial state
- should initialize correctly state when offer isDigital
- should initialize the state when offer isDigital only with first bookable stocks
- should not display the Duo selector when the offer is not duo


 when user has selected options
- should render disable CTA when user is underage and stock is forbidden to underage
- should run validation booking when pressing "Confirmer la réservation" button
- should not display the loading screen when booking validation is not in progress
- should display the loading screen when booking validation is in progress


 duo selector
- should not display the Duo selector when the offer is duo but is an event
- should display the Duo selector when the offer is duo and not an event


 venue name
- should display venue name in venue section
- should display name from offer address when present
- should display venue name when offer address is not present


 venue address
- should display venue address in venue section
- should display offer address when present
- should display venue address when offer.address is not present


 HeaderMessage


 CGU
- should have "Confirmer la réservation" disabled when CGU button has not been checked


 <BookingDetails />
- should change step to confirmation when step is date and offer is not an event
- should not change step to confirmation when step is date and offer is an event
- should not display venue address in information section
- should display venue section
- should display "Modifier" button when offer subcategory is "Livre papier", EAN defined and that there are other venues offering the same offer
- should not display "Modifier" button when offer subcategory is "Livre papier", EAN defined and that there are not other venues offering the same offer
- should display "Modifier" button when offer subcategory is "Livre audio physique", EAN defined and that there are other venues offering the same offer
- should not display "Modifier" button when offer subcategory is "Livre audio physique", EAN defined and that there are not other venues offering the same offer
- should not display "Modifier" button when offer subcategory is "Livre papier" and EAN not defined
- should not display "Modifier" button when offer subcategory is "Livre audio physique" and EAN not defined
- should open venue selection modal when pressing "Modifier" button
- should update the booking offer when the user choose an other venue
- should have "Confirmer la réservation" enabled when CGU button has been checked
- should display deducted amount message
- should not display deducted amount message when free user status

