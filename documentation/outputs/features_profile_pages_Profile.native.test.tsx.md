Profile
 achievements banner
- should show banner when user is a beneficiary
- should not show banner if user is not a beneficiary
- should go to achievements when user clicks the banner


 geolocation switch
- should display switch ON if geoloc permission is granted
- should display position error message if geoloc permission is granted but position is null
- should display switch OFF if geoloc permission is denied
- should open "Deactivate geoloc" modal when clicking on ACTIVE switch and call mockFavoriteDispatch()


 user settings section
- should navigate when the personal data row is clicked
- should navigate when the notifications row is clicked


 help section
- should navigate to Age Information when tutorial row is clicked, user is logged in
- should navigate when the faq row is clicked
- should display tutorial row when user is exbeneficiary
- should display tutorial row when user has no credit and no upcoming credit


 other section
- should navigate when the display preference row is clicked
- should navigate when the accessibility row is clicked
- should navigate when the legal notices row is clicked
- should navigate when the feed back row is clicked
- should navigate when the confidentiality row is clicked


 share app section
- should display banner in native
- should share app on banner press


 signout section
- should display signout row if the user is connected
- should NOT display signout row if the user is NOT connected
- should delete the refreshToken, clean user profile and remove user ID from batch when pressed


 Analytics
- should log event ConsultTutorial when user clicks on tutorial section
- should log event ProfilScrolledToBottom when user reach end of screen
- should log event ShareApp on share banner press


 Profile component
- should render correctly
- should render offline page when not connected
- should display the version with the CodePush version label
- should not display the Code push version label when it is not available
- should display "Débuggage" button when user is logged in
- should NOT display "Débuggage" button when user is logged in BUT feature flag is disable
- should NOT display "Débuggage" button when user is not logged in

