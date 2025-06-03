useResetOnMinimalBuild
 useResetOnMinimalBuild
- should call resetErrorBoundary on component unmount
- should not call resetErrorBoundary if minimalBuildNumber is null
- should not call resetErrorBoundary if minimalBuildNumber is greater than app build version
- should call resetErrorBoundary if minimalBuildNumber is less than or equal to app build version

