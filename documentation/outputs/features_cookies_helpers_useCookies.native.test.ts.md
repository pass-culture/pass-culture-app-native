useCookies
 state
- should be undefined by default
- should write state


 user ID
- can set user ID
- can set user ID before giving cookies consent
- store user ID when user has not give his cookie consent with no consent
- dont send user consent when user not give cookies consent
- should overwrite user ID when setting another user ID


 storage
- should not start tracking accepted cookies if only userId is already in storage
- should save cookies consent in the storage
- should restore cookies consent from the storage
- should start tracking accepted cookies when consent is already in storage
- should update date when call setCookiesConsent is called
- should clear consent and choice date when user has made choice 6 months ago


 When shouldLogInfo remote config is false
- should not notify sentry


 When shouldLogInfo remote config is true
- should notify sentry


 when can not log cookies consent choice
- should not throw errors


 log API
- should persist cookies consent
- should persist user ID
- should not log cookies consent choice when user logs in with same account


 useCookies
- should set once device ID per device

