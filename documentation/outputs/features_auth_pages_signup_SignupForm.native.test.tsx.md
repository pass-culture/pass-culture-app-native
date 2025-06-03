SignupForm
 For each step


 Quit button
- should not display quit button on firstStep
- should open quit modal when pressing quit button on second step
- should go back to home when pressing close button on email confirmation sent


 Go back button
- should call goBack() when left icon is pressed from first step
- should go to the previous step when go back icon is press from second step
- should not display backButton on confirmation email sent page


 analytics
- should trigger StepperDisplayed tracker when displaying step
- should log analytics when clicking on close icon
- should call logCancelSignup with Email when quitting after signup modal


 API
- should create account when clicking on AcceptCgu button with trustedDevice
- should log to sentry on API error


 analytics
- should trigger StepperDisplayed tracker with SSO_signup type when displaying step for sso subscription
- should trigger StepperDisplayed tracker with SSO_login type when displaying step for sso subscription and coming from login


 SSO
- should sign in when sso button is clicked and sso account already exists
- should go to next step when sso button is clicked and sso account does not exist
- should go back to email step instead of password step when signing up with sso button
- should display go back for last step
- should reset isSSOSubscription state when choosing sso first then choosing default signup
- should create SSO account when clicking on AcceptCgu button
- should login and redirect user on SSO signup success
- should login and redirect user on SSO signup success when coming from signup
- should directly go to birthday step when account creation token is in route params
- should create SSO account when clicking on AcceptCgu button and coming from login


 Signup Form
- should show email sent confirmation on signup success

