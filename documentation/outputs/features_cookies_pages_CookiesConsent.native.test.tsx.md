CookiesConsent
 accept all cookies
- should persist cookies consent information
- should enable tracking
- should log analytics
- should init AppsFlyer
- should save UTM params
- should hide modal


 refuse all cookies
- should persist cookies consent information
- should disable tracking
- should not init AppsFlyer
- should not set marketing params
- should hide modal


 make detailled cookie choice
- should persist cookies consent information when user partially accepts cookies
- should call startTrackingAcceptedCookies with empty array if all cookies are refused
- should call startTrackingAcceptedCookies with performance if performance cookies are accepted
- should log analytics if performance cookies are accepted
- should call setMarketingParams with empty array when all cookies are refused
- should call setMarketingParams with customization cookies when they are accepted
- should hide modale when user saves cookies choice


 <CookiesConsent/>
- should render correctly

