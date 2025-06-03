useFeatureFlag
 minimalBuildNumber


 maximalBuildNumber
- should activate FF when version is below maximalBuildNumber
- should activate FF when version is equal to maximalBuildNumber
- should deactivate FF when version is greater than maximalBuildNumber


 When shouldLogInfo remote config is false
- should not log to sentry when minimalBuildNumber is greater than maximalBuildNumber


 When shouldLogInfo remote config is true
- should log to sentry when minimalBuildNumber is greater than maximalBuildNumber


 maximal and minimal build numbers
- should activate FF when version is between minimalBuildNumber and maximalBuildNumber
- should activate FF when minimalBuildNumber and maximalBuildNumber are equal to current version
- should deactivate FF when minimalBuildNumber and maximalBuildNumber are equal and below current version
- should deactivate FF when minimalBuildNumber and maximalBuildNumber are equal and greater than current version
- should deactivate FF when minimalBuildNumber is greater than maximalBuildNumber


 useFeatureFlag
- should deactivate FF when no build number is given

