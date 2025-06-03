expirationDateUtils
 getEligibleBookingsForArchive
- should return an array with unique bookings when a booking appears in both categories


 getDigitalBookingsWithoutExpirationDate
- should get an array with a booking if is digital and without expiration date
- should return an empty array


 isBookingInList
- should check if a booking does exist in the list of DigitalBookingWithoutExpirationDate array and return true if it exist
- should check if a booking does exist in the list of DigitalBookingWithoutExpirationDate array and return false if it does not exist


 displayExpirationMessage
- should display expiration message : Ta réservation s’archivera dans ${daysLeft} jours
- should display expiration message : Ta reservation s’archivera demain, when the offer archives the next day
- should display expiration message : Ta réservation s’archive aujourd’hui, when the offer archives today
- should display nothing when daysLeft < 0


 daysCountdown
- should return the days countdown between two dates
- should return -1 when the countdown ended


 formattedExpirationDate
- should formatted expiration date from the created date
- should return an empty string when dateCreated is an empty string


 should return false
- when booking is digital with expiration date
- when booking is not digital without expiration date
- when booking is not digital with expiration date


 isDigitalBookingWithoutExpirationDate
- should return true when booking is digital without expiration date


 isFreeBookingInSubcategories
- should return true when booking amount is 0 and the offer has a category that can be archived
- should return false when booking amount is 0 and the offer has not a category that can be archived
- should return false when booking amount > 0 and the offer has a category that can be archived


 expirationDateUtils

