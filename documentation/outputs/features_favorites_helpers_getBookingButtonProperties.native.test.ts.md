getBookingButtonProperties
 when user is eligible
- should call eligible button props helpers


 when user is beneficiary
- should call eligible button props helpers


 when user is ex beneficiary
- should return "Offre réservée" and button should be disabled when offer is already booked
- should return "Réserver" and button should be enabled when offer is free
- should return external link when offer has external url


 when user is not beneficiary
- should return external link when offer has external url


 getBookingButtonProperties

