SetPhoneValidationCode
 SetPhoneValidationCode
- should match snapshot
- should have 'Continue' button enabled according to code format
- should have modal closed on render, and open modal when clicking on 'code non reçu'
- should display input error message if code request fails
- should navigate to TooManyAttempts if too many attempts
- should call navigateToNextScreen if validation succeeds
- should log event when pressing "Code non reçu ?" button
- should log analytics on press continue

