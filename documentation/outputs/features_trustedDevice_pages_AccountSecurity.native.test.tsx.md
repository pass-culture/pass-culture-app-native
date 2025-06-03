AccountSecurity
 when user is connected and has a password
- should match snapshot with valid token
- should navigate to reinitialize password when choosing this option
- should navigate to home password when choosing no security
- should log analytics when choosing no security
- should navigate to account suspension confirmation when choosing this option


 when user is connected and has no password (sso)
- should show alternative wording
- should not show button to change the password


 when user is disconnected
- should show button to change the password


 with route params


 without route params
- should match snapshot when no token


 <AccountSecurity/>

