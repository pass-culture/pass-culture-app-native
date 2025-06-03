BookingDetailsTicketContent
 EAN
- should display EAN when the offer is a book with an EAN
- should not display EAN when the offer is a book without an EAN
- should not display EAN when the offer is not a book


 BarCode
- should display BarCode when the offer is an external booking with barCode and category is MUSIC_LIVE
- should not display barCode when the booking is not an external one
- should not display barCode when category is not MUSIC_LIVE


 BookingDetailsTicketContent
- should display the booking activation code when booking has one
- should not display the booking token when booking has activation code
- should display the booking token when booking has no activation code
- should display the access button offer when booking has activation code
- should not display the access button offer when offer is not digital and booking has no activation code
- should display the access button offer when offer is digital and booking has no activation code

