BookingOfferModal
 when booking validated
- should dismiss the modal on success
- should log confirmation booking when offer booked from a similar offer
- should log confirmation booking when offer not booked from a similar offer
- should log conversion booking when is from search
- should not log conversion booking when is not from search
- should log campaign tracker when booking is complete
- should navigate to booking confirmation when booking is complete


 when booking failed
- should dismiss the modal on error
- should log booking error when error is known
- should log booking error when error is unknown


 when booking comes from a movie screening
- should update bookingState when bookingDataMovieScreening props is received
- should log HAS_BOOKED_CINE_SCREENING_OFFER


 when booking step is confirmation


 <BookingOfferModalComponent />
- should dismiss modal when click on rightIconButton and reset state
- should set offer consulted when dismiss modal and an other venue has been selected
- should not log event ClickBookOffer when modal is not visible
- should log event ClickBookOffer when modal opens
- should show AlreadyBooked when isEndedUsedBooking is true
- should log booking funnel cancellation event when closing the modal
- should display modal with prices by categories

