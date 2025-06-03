CodeNotReceivedModal
 <CodeNotReceivedModal />
- should match snapshot
- should have a different color if one attempt remaining
- should call dismissModal upon pressing on Close
- should dismiss modal on /send_phone_validation_code request success
- should dismiss modal if request fails
- should show toaster with error message if request fails
- should navigate to SetPhoneNumberTooManySMSSent page if request fails with TOO_MANY_SMS_SENT code
- should log event when pressing "Demander un autre code" button

