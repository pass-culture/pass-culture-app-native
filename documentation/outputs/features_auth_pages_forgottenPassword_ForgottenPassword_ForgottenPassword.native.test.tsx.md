ForgottenPassword
 email format validation
- should NOT display invalid email format when email format is valid
- should display invalid email format when email format is valid


 <ForgottenPassword />
- should match snapshot
- should enable validate button when email input is filled
- should show email suggestion
- should redirect to Login when clicking on ArrowPrevious icon
- should NOT open reCAPTCHA challenge's modal when there is no network
- should open reCAPTCHA challenge's modal when pressing on validate button
- should redirect to ResetPasswordEmailSent when password reset request is successful
- should log to Sentry on reCAPTCHA failure
- should not log to Sentry on reCAPTCHA network error
- should notifies user on reCAPTCHA network error
- should NOT redirect to ResetPasswordEmailSent when reCAPTCHA challenge has failed
- should NOT redirect to ResetPasswordEmailSent when reset password request API call has failed
- should not capture an in Sentry when reset password request API call has failed and error code is 400

