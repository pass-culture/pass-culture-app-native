SuspendAccountConfirmation
 should navigate to home
- When there is no email change
- When pressing "Ne pas suspendre mon compte" button
- When pressing "Oui, suspendre mon compte" button and API response is error and is not a 401 error


 should navigate to change email expired
- When last email change expired
- When pressing "Confirmer la demande" button and API response is a 401 error


 <SuspendAccountConfirmation />
- should display message and buttons when there is current email change
- should navigate to email change tracking when pressing "Confirmer la demande" button and API response is success
- should display an error snackbar when pressing "Confirmer la demande" button and API response is error and is not 401 error
- should not display an error snackbar when pressing "Confirmer la demande" button and API response is a 401 error

