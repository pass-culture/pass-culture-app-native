SetEmail
 SSO
- should display SSO button when FF is enabled
- should not display SSO button when FF is disabled
- should go to next step when clicking SSO button and account does not already exist
- should display snackbar when SSO account is invalid


 <SetEmail />
- should disable validate button when email input is not filled
- should display disabled validate button when email input is filled with spaces
- should enable validate button when email input is filled
- should go to next step on valid email with email and newsletter params
- should hide email help message when email is valid
- should reject invalid email when trying to submit
- should log analytics when clicking on "Se connecter" button
- should display suggestion with a corrected email when the email is mistyped
- should log analytics when user select the suggested email
- should navigate to Login with provided offerId when clicking on "Se connecter" button
- should set a default email if the user has already added his email
- should set default marketing email subscription choice to true if the user has already chosen
- should set default marketing email subscription choice to false

