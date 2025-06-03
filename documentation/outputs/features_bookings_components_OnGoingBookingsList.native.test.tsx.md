OnGoingBookingsList
 offline
- should allow pull to refetch when netInfo.isConnected && netInfo.isInternetReachable
- should show snack bar error when trying to pull to refetch with message "Impossible de recharger tes réservations, connecte-toi à internet pour réessayer."


 displays the placeholder
- when bookings are loading
- when subcategories are loading


 <OnGoingBookingsList /> - Analytics
- should trigger logEvent "BookingsScrolledToBottom" when reaching the end
- should trigger logEvent "BookingsScrolledToBottom" only once

