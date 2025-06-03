useSearchHistory
 When shouldLogInfo remote config is true
- should capture a message in Sentry when adding to history fails


 When shouldLogInfo remote config is false
- should not capture a message in Sentry when adding to history fails


 useSearchHistory
- should initialize the history correctly
- should return an empty array when loading history failed
- should initialize the query history correctly
- should load the history from storage correctly
- should add an item to the history
- should not capture a message in Sentry when adding to history does not fail
- should replace an item already present to the history
- should update the local storage when added an item to the history
- should remove an item from the history
- should not display error message when removing from history does not fail
- should display error message when removing from history fails
- should update the local storage when deleted an item from history
- should execute an history search with a query not empty
- should execute an history search with an empty query
- should return 20 items maximum in the history when queryHistory is an empty string
- should return 3 items maximum in the history when queryHistory is not an empty string

