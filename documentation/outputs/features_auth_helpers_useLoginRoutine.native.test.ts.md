useLoginRoutine
 connectServicesRequiringUserId
- should set batch identifier
- should log set user id analytics
- should set user id in cookies consent storage


 resetContexts
- should reset search context because search results can be different for connected user (example: video games are hidden for underage beneficiaries)
- should reset identity check context because user logged in can be different than previous user


 useLoginRoutine
- should saveRefreshToken
- should log login analytics
- should log login analytics with sso type when defined
- should save access token to storage
- should schedule access removal when it expires

