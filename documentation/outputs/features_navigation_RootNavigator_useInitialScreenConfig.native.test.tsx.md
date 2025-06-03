useInitialScreenConfig
 useInitialScreen()
- should return TabNavigator when logged in user has seen tutorials and eligible card without need to fill cultural survey
- should return CulturalSurveyIntro when user should see cultural survey
- should return EighteenBirthday when user hasn’t seen eligible card
- should return RecreditBirthdayNotification when user hasn’t seen eligible card and has credit to show
- should return TabNavigator when user is not logged in and has seen tutorial
- should return OnboardingWelcome when user is not logged in and hasn’t seen tutorial yet

