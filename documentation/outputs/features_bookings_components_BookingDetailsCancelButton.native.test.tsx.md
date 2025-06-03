BookingDetailsCancelButton
 When it's an offer category to archive and it's not free
- should not display expiration date message
- should display cancel button


 When it's a free offer category to archieve
- should display expiration date message when current price and price at booking time is 0
- should not display cancel button when current price and price at booking time is 0
- should display expiration date message when current price > 0 and price at booking is 0
- should not display cancel button when current price > 0 and price at booking is 0


 <BookingDetailsCancelButton />
- should display the "Terminer" button for digital offers when booking has activation code
- should display button if confirmationDate is null
- should display button if confirmation date is not expired
- should not display button if confirmation date is expired
- should call onCancel
- should call onTerminate
- should block user if cancellation date is over
- should block user if cancellation date is over and user is ex beneficiary
- should display cancel button and expiration date message when confirmation date is null and that's it a digital booking
- should display only an expiration date message when the booking is digital and is not still cancellable
- should not display section if there is no expirationDate and no confirmation date for a digital booking
- should not display section if there is no expirationDate and offer is FreeOfferToArchive

