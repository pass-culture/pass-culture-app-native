EmailResendModal
 When shouldLogInfo remote config is false
- should not log to Sentry on error


 When shouldLogInfo remote config is true
- should log to Sentry on error


 <EmailResendModal />
- should render correctly
- should dismiss modal when close icon is pressed
- should log analytics when resend email button is clicked
- should resend email when resend email button is clicked
- should display timer when resend email button is clicked
- should display error message when email resend fails
- should display error message when maximum number of resends is reached
- should reset error message when another resend attempt is made
- should display alert banner when there is no attempt left

