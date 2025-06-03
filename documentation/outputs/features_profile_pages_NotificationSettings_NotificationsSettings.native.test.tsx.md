NotificationsSettings
 When the user saves the changes
- should update profile
- should show snackbar on success
- should show snackbar on error
- should reset settings on error


 The behavior of the push switch
- should open the push notification modal when the push toggle is pressed and the permission is not granted
- should open the settings from the push notifications modal
- should toggle push switch when permission is granted and user press it


 When user has unsaved changes and attempts to go back
- should display a modal


 Analytics
- should log subscription update when user changes their subscription
- should log notification toggle update when user changes their settings
- should log notification toggle update when user changes their settings from save modal
- should not log subscription update when user only changes their notifications settings


 NotificationsSettings
- should render correctly when user is logged in
- should render correctly when user is not logged in
- should disabled save button when user is not logged in
- should disabled save button when user hasn‘t changed any parameters
- should enable save button when user has changed a parameter
- should get user default parameters
- should switch on all thematic toggles when the "Suivre tous les thèmes" toggle is pressed
- should switch off all thematic toggles when the "Suivre tous les thèmes" toggle is pressed when active
- should toggle on specific theme when its toggle is pressed
- should disabled all thematic toggles when email toggle and push toggle are inactive
- should switch off thematic toggle when disabling email and push toggle at the same time
- should display help message when the email toggle is inactive and user is logged in
- should display info banner when email and push toggles are inactive
- should not display info banner when at least email or push toggles is active
- should not display info banner when user is not logged in

