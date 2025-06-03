jwt
 getTokenStatus
- unknown status given no access token
- unknown status when access token can't be read
- expired status given access token that expires before current date
- valid status given access token that expires in the future and expiration is more than 1 minute away
- expired status given access token that expires in the future and expiration is exactly 1 minute
- expired status given access token that expires in the future and expiration is less than 1 minute away


 computeTokenRemainingLifetimeInMs
- should return undefined when token can not be decoded
- should return remaining lifetime in milliseconds

