SuspensionChoice
 When shouldLogInfo remote config is false
- should not capture an info in Sentry on suspension error


 When shouldLogInfo remote config is true
- should capture an info in Sentry on suspension error


 <SuspensionChoice/>
- should match snapshot
- should navigate to suspension confirmation screen on suspension success
- should show snackbar on suspension error
- should log an error in Sentry on suspension error
- should open mail app when clicking on "Contacter le support" button
- should log analytics when clicking on "Contacter le service fraude" button
- should open CGU url when clicking on "conditions générales d’utilisation" button

