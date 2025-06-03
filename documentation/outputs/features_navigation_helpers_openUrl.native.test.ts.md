openUrl
 ExternalUrl
- should open links on browser using custom module on Android
- should open links on browser using Linking when url is invalid on Android
- should open links with Linking on iOS


 InApp screen
- should navigate to in-app screen (ex: Offer)
- should navigate to external screen even when screen is in-app when isExternal is true (ex: Offer)
- should navigate to PageNotFound when in-app screen cannot be found (ex: Offer)
- should log to sentry and navigate to the home when there is an error


 Analytics
- should log analytics when shouldLogEvent is true (default behavior)
- should not log analytics event when shouldLogEvent is false


 Alert prompt
- should display alert when Linking.openURL throws
- should not display alert when Linking.openURL throws but fallbackUrl is valid


 openUrl

