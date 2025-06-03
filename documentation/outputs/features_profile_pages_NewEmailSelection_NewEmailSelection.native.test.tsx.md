NewEmailSelection
 email format
- should show email suggestion
- should not display invalid email format when email format is valid
- should display invalid email format when email format is invalid


 <NewEmailSelection />
- should match snapshot
- should enable submit button when email input is filled
- should disable submit button when email input is invalid
- should navigate to email change stepper on new email selection success
- should show success snackbar on new email selection success
- should show log to sentry if token is undefined
- should show error snackbar on new email selection failure

