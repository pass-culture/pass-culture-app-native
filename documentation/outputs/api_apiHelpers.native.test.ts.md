apiHelpers
 [method] safeFetch
- should call fetch with populated header
- should call fetch with populated header when route is in NotAuthenticatedCalls
- needs authentication response when refresh token fails
- forces user to login when refresh token is expired
- regenerates the access token and fetch the real url after when the access token is expired
- should call refreshAccessToken route once when no error
- should not call refreshAccessToken route while the token is still valid
- should call refreshAccessToken route again after 15 minutes (access token's lifetime)
- should refresh access token when it is unknown and refresh token is valid
- needs authentication response when there is no refresh token
- needs authentication response when cannot get refresh token
- log exception to sentry when cannot get refresh token
- retries to regenerate the access token when the access token is expired and the first try to regenerate fails


 handleGeneratedApiResponse
- should return body when status is ok
- should return body when status is ok given a plain text response
- should return empty object when status is 204 (no content)
- should navigate to suspension screen when status is 403 (forbidden)
- should navigate to banned country screen when status is 403 (forbidden) with country ban header
- should capture a detailed error on Sentry when status is 401
- should navigate to login when access and refresh tokens are invalid


 isAPIExceptionCapturedAsInfo
- should return true when error code is 401


 isAPIExceptionNotCaptured
- should return false when error code is 401


 [api] helpers

