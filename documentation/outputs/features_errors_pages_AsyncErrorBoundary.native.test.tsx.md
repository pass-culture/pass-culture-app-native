AsyncErrorBoundary
 should capture exception
- when error is Error
- when error is ApiError and error code is 400


 When shouldLogInfo remote config is true
- should capture info when error is ApiError and error code is 401


 When shouldLogInfo remote config is false
- should not capture info when error is ApiError and error code is 401


 should not capture info
- when error is MonitoringError
- when error is ApiError and error code is 400


 should not capture exception
- two times when error is MonitoringError
- when error is ScreenError and log type is ignored


 should capture message
- when error is ScreenError and log type is info


 AsyncErrorBoundary component
- should render
- should go back on back arrow press
- should call retry with AsyncError


 Usage of AsyncErrorBoundary as fallback in ErrorBoundary
- should display custom error page when children raise error

