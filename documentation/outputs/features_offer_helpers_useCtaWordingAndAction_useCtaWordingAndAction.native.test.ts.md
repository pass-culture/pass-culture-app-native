useCtaWordingAndAction
 Logged out user
- should display "Réserver l’offre" wording and modal "authentication"


 Free offer
- should display "Réserver l’offre" wording with navigate to SetName screen and params type
- should display "Réserver l’offre" wording with navigate to ProfileInformationValidation screen and params type
- should display "Réserver l’offre" wording and open booking modal when user profile complete
- should disable CTA with bottom banner when profile is incomplete and offer is not free
- should disable CTA with "Réserver l’offre" wording when profile is complete and offer is not free


 Non eligible user
- should display "Réserver l’offre" disabled wording with bottom banner when no external url
- should display "Accéder au site partenaire" wording when external url
- should display "Accéder au site partenaire" wording when external url and offer is digital and free


 Eligible but non Beneficiary yet user
- should return finish subscription modal when user has not finished subscription
- should return application pending modal when user is waiting for his application to complete
- should return application error modal when user has an issue with his application


 Non Beneficiary user


 Educational offer


 Underage beneficiary user


 Beneficiary user
- CTA="Offre épuisée" if offer is sold out
- CTA="Offre expirée" if offer is expired and sold out
- CTA="Offre expirée" if offer is expired
- CTA="Offre expirée" if offer is not released
- CTA="Réserver l’offre" if offer is an ended booking
- CTA="Accéder à l’offre en ligne" when offer is digital and free
- CTA="Réserver l’offre" when offer is a free digital event
- CTA="Réserver l’offre" when offer is digital and not free


 CTA - Analytics
- logs event ClickBookOffer when we click CTA "Réserver l’offre" (beneficiary user)
- logs event ClickBookOffer when we click CTA "Réserver l’offre" on free digital event not already booked
- logs event logViewedBookingPage when we click CTA "Réserver l’offre" on free digital event already booked
- logs event ClickBookOffer when CTA "Voir les disponibilités" is clicked
- logs event ConsultAvailableDates when we click CTA "Voir les disponibilités" (beneficiary user)
- logs event ConsultFinishSubscriptionModal when we click CTA "Réserver l’offre" with has_to_complete_subscription status
- logs event ConsultApplicationProcessingModal when we click CTA "Réserver l’offre" with has_subscription_pending status
- logs event ConsultErrorApplicationModal when we click CTA "Réserver l’offre" with has_subscription_issues status


 CTA - XP cine on Offer page
- should return bottomBannerText and no wording if user is not eligible
- should return bottomBannerText and no wording if user has expired credit
- should return bottomBannerText and no wording if user has not enough credit
- should display "Réserver l’offre" wording and modal "authentication" if user is not logged in
- should return application pending modal when user is waiting for his application to complete


 getCtaWordingAndAction

