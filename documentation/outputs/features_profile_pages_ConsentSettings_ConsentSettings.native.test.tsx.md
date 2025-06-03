ConsentSettings
 <ConsentSettings/>
- should render correctly
- should persist cookies consent information when user partially accepts cookies
- should call startTrackingAcceptedCookies with empty array if user refuses all cookies
- should call startTrackingAcceptedCookies with cookies performance if user accepts performance cookies
- should log analytics if performance cookies are accepted
- should show snackbar and navigate to home on save

