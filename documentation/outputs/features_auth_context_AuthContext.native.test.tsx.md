AuthContext
 useAuthContext
- should not return user when logged in but no internet connection
- should return the user when logged in with internet connection
- should return undefined user when logged out (no token)
- should return undefined when refresh token is expired
- should return refetchUser
- should set user properties to Amplitude events when user is logged in
- should not set user properties to Amplitude events when user is not logged in
- should set user id when user is logged in
- should log out user when refresh token is no longer valid
- should log out user when refresh token remaining lifetime is longer than max average session duration
- should not navigate to login with the force display message when user has no refresh token
- should navigate to login with the force display message when the refresh token is expired
- should navigate to login with the force display message when the refresh token expires during user session
- should clear refresh token when it expires
- should log to Sentry when error occurs


 AuthContext

