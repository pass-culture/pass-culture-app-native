BookingDetails
 <DetailedBookingTicket />
- should display booking token
- should display offer link button if offer is digital and open url on press
- should not display offer link button if no url
- should display booking qr code if offer is physical
- should display EAN code if offer is a book (digital or physical)


 Offer rules
- should display rules for a digital offer
- should display rules for a digital offer with activation code


 withdrawalDetails
- should display withdrawal details
- should not display withdrawal details


 booking email contact
- should display booking email contact when there is a booking contact email
- should not display booking email contact when there is no booking contact email
- should open mail app and log ClickEmailOrganizer when clicking on Venue's mail address


 cancellation button
- should log event "CancelBooking" when cancelling booking


 should display it and navigate to bookings
- when booking is digital with expiration date
- when booking is not digital with expiration date
- when booking is not digital without expiration date


 cancellation message
- should not display it and not navigate when booking is digital without expiration date


 booking not found
- should render ScreenError BookingNotFound when booking is not found when data already exists
- should not render ScreenError BookingNotFound when booking is not found and no data exists


 Itinerary


 Analytics
- should trigger logEvent "BookingDetailsScrolledToBottom" when reaching the end


 OldBookingDetails : when FF WIP_NEW_BOOKING_PAGE is off
- should call useOngoingOrEndedBooking with the right parameters
- should render correctly
- should redirect to the Offer page and log event
- should not redirect to the Offer and showSnackBarError when not connected


 OldBookingDetails : when FF WIP_NEW_BOOKING_PAGE is on an is not Event
- should render OldBookingPageContent


 BookingPageContent : when FF WIP_NEW_BOOKING_PAGE is on and offer is Event
- should render BookingPageContent
- should render the itinerary button when offer is Event
- should display banner warning about disposal
- should render organizer's indications
- should render organizer's email
- should log analytics on email press
- should redirect to the Offer page and log event
- should not redirect to the Offer and showSnackBarError when not connected
- should render correctly when offer is not digital withdrawal type is no ticket
- should render error message with plural when booking is duo
- should render error message singular when booking is not duo


 BookingDetails

