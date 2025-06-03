BookingImpossible
 When offer is already favorite
- should render without CTAs
- should log 'BookingImpossibleiOS' on mount
- should dismiss modal when clicking on 'Voir le détail de l’offre'


 When offer is not yet favorite
- should render with CTAs
- should send email/push notification when adding to favorites
- should log analytics event when adding to favorites
- should change booking step from date to confirmation
- should dismiss modal when clicking on 'Retourner à l'offre'


 <BookingImpossible />

