useGoBack.web
 customCanGoBack()
- should return true if canGoBack = true


 customGoBack()
- should use navigate if canGoBack = false
- should use history if previous route doesn't exist and canGoBack = true
- should call goBack if previous route exists and canGoBack = true


 useGoBack()

