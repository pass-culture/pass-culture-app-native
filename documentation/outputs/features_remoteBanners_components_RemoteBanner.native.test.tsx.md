RemoteBanner
 accessibility
- should have correct accessibilityRole for store redirection
- should have correct accessibilityRole for external redirection
- should have correct accessibilityLabel for store redirection
- should have correct accessibilityLabel for external redirection


 <RemoteBanner/>
- should not be displayed when the showRemoteGenericBanner FF is disable
- should not be displayed when no redirection type or external URL
- should not be displayed when redirection is external, but URL is an empty string
- should not be displayed external URL is missing
- should displayed when redirection type is an expected value
- should not be displayed when redirection type is an unexpected value
- should log sentry when redirection type is an unexpected value
- should navigate to store and a11y label should be correct when redirection is to app store
- should navigate to url and a11y label should be correct when redirection is external
- should log analytics when user presses banner

