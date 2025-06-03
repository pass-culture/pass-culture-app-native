ValidateEmailChange
 ValidateEmailChange
- should render new email address
- should sign out if submit is success and user is logged in
- should not sign out if submit is success and user is not logged in
- should redirect to Login if submit is success
- should display a snackbar if submit is success
- should redirect to ChangeEmailExpiredLink if submit triggers a 401 error
- should display an error message if submit triggers an error not 401
- should not display an error message if submit triggers an error  401
- should redirect to change email expired when status is expired
- should redirect to home when there is no email update
- should log to sentry, redirect to home and show error message when token is falsy

