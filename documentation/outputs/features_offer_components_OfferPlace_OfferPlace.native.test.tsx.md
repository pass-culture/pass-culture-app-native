OfferPlace
 Venue is permanent
- should not display "Voir la page du lieu" button when venue is not permanent
- should navigate to venue page when pressing venue button
- should log ConsultVenue when pressing venue button


 "Voir l’itinéraire" button
- should display "Voir l’itinéraire" button when complete venue address specified
- should log consult itinerary when pressing "Voir l’itinéraire" button
- should not display "Voir l’itinéraire" button when venue address, city and postal code not provided
- should not display "Voir l’itinéraire" button when only venue address provided
- should not display "Voir l’itinéraire" button when only venue city provided
- should not display "Voir l’itinéraire" button when only venue city postalCode


 HeaderMessage


 <OfferPlace />
- should display change venue button when offer subcategory is "Livres audio", offer has an EAN and that there are other venues offering the same offer
- should display new xp cine block when offer subcategory is "Seance cine" and FF is on
- should display change venue button when offer subcategory is "Seance cine", offer has an allocineId and that there are other venues offering the same offer
- should display "Trouve ta séance" above Venue when offer subcategory is "Seance cine"
- should not display "Trouve ta séance" above Venue when offer subcategory is not "Seance cine"
- should not display change venue button when offer subcategory is "Seance cine", offer has not an allocineId
- should not display change venue button when offer subcategory is "Livres audio", offer has an EAN and that there are not other venues offering the same offer
- should not display change venue button when offer subcategory is "Livres audio" and offer has not an EAN
- should display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer
- should not display change venue button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer
- should not display change venue button when offer subcategory is "Livres papier" and offer has not an EAN
- should not display change venue button when offer subcategory is not "Livres papier" or "Livres audio"
- should display venue block With "Lieu de l’évènement" in title
- should navigate to an other offer when user choose an other venue from "Changer le lieu de retrait" button
- should log ConsultOffer when new offer venue is selected
- should log when the users press "Changer le lieu de retrait" button
- should display venue tag distance when user share his position
- should not display venue tag distance when user not share his position
- should display container with divider on mobile
- should not display container with divider on desktop
- should display container without divider on desktop
- should not display container without divider on mobile

