VenueSelectionModal
 When user share his position
- should not display "Active ta géolocalisation" button


 When user doesn't share his position
- should display "Active ta géolocalisation" button
- should open "Paramètres de localisation" modal when pressing "Active ta géolocalisation" button and permission is never ask again
- should close geolocation modal when pressing "Activer la géolocalisation"


 When user has forbidden his position
- should ask for permission when pressing "Active ta géolocalisation" button and permission is denied


 <VenueSelectionModal />
- should render items
- should close modal
- should not call onSubmit with no selection
- should call onSubmit with item selected

