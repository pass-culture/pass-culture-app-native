## Web app upgrade detection

The service-worker is in charge of detecting new versions of the Web App.

It is important to not modify it often, as we have experienced a failure of it during this PR:

https://github.com/pass-culture/pass-culture-app-native/commit/496d528351cb7aaabeb8a40ed7b2e13175e389a0

After this, the Web app detected the new version, and reloaded the app, on the same version, without upgrading to the new one.

This cause infinite reloading of our app. 

Instead, we reverted that PR and keeped the importScript we wanted to remove with just a comment.
