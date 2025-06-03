TicketBody
 <QrCode/> display
- should display the QR code when the the booking have a QR code and the offer subcategory allows to have a qr code
- should not display the QR code when event subcategory is in subcategories list without QR code display


 when FF enableHideTicket is true
- should be hidden until 2 days before the event
- should be displayed 2 days before the event


 when FF enableHideTicket is false
- should not be hidden even until 2 days before the event


 concert or festival
- should display the availability date
- should display the availability time


 QrCode for external bookings
- should be displayed when it is not a concert or festival


 <NoTicket/> display
- should display no ticket withdrawal wording


 <TicketWithdrawal/> display
- should display on site withdrawal delay when delay is specified


 Consulter mes e-mails display
- should show the button to open mail
- should not show the button to open mail if no mail app is available


 Withdrawal
- should not display withdrawal informations for legacy offer that doesn't withdrawal informations
- should display by email withdrawal delay when delay is specified and email is normally received


 TicketBody

