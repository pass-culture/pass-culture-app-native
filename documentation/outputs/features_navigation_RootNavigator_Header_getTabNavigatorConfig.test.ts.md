getTabNavigatorConfig
 for non-SearchStackNavigator routes
- should call getTabNavConfig with received route


 for SearchStackNavigator route
- should return config with empty params when route is not selected
- should return config with searchState reinitialized except for location when route is selected


 getTabNavigatorConfig

