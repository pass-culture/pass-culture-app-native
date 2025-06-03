SSOButton
 When shouldLogInfo remote config is false
- should not log to Sentry on SSO login error


 When shouldLogInfo remote config is true
- should log to Sentry on SSO login error


 <SSOButton />
- should sign in with device info when sso button is clicked
- should call onSignInFailure when signin fails
- should log analytics when logging in with sso from signup
- should log analytics when logging in with sso from login

