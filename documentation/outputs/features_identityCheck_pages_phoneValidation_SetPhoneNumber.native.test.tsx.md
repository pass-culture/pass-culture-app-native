SetPhoneNumber
 continue button
- should enable the button when the phone number is valid
- should navigate to SetPhoneValidationCode on /send_phone_validation_code request success
- should display input error message if validate phone number request fails
- should navigate to SetPhoneNumberTooManySMSSent page if request fails with TOO_MANY_SMS_SENT code
- should log event HasRequestedCode when pressing "Continuer" button
- should log analytics when pressing "Continuer" button


 SetPhoneNumber
- should match snapshot without modal appearance
- should show modal on first render
- should have a different color if 1 attempt is remaining

