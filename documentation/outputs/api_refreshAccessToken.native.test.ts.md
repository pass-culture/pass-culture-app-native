refreshAccessToken
 refreshAccessToken
- should remove access token when there is no refresh token
- should return FAILED_TO_GET_REFRESH_TOKEN_ERROR when there is no refresh token
- should store the new access token when everything is ok
- should return the new access token when everything is ok
- should remove tokens when there is an unexpected behavior
- should return LIMITED_CONNECTIVITY_WHILE_REFRESHING_ACCESS_TOKEN when connectivity is limited
- should return UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN when there is an unexpected behavior
- should retry to refresh access token when the first call fails
- should remove tokens when refresh token is expired
- should return REFRESH_TOKEN_IS_EXPIRED_ERROR when refresh token is expired
- should log to sentry when can't refresh token

