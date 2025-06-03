CulturalSurveyQuestions
 CulturalSurveyQuestions page
- should render the page with correct layout
- should navigate to next page when pressing Continuer
- should refetch user infos if on lastQuestion and API call is successful
- should flush answers if on lastQuestion and API call is successful
- should navigate to Home if on lastQuestion and API call is successful and FF ENABLE_CULTURAL_SURVEY_MANDATORY is disabled
- should navigate to CulturalSurveyThanks if on lastQuestion and API call is successful and FF ENABLE_CULTURAL_SURVEY_MANDATORY is enabled
- should navigate to home if on lastQuestion and API call is unsuccessful
- should dispatch empty answers on go back
- should dispatch default questions on go back when current question is "sorties"
- should updateQuestionsToDisplay on checkbox press if answer pressed has sub_question
- should not updateQuestionsToDisplay on checkbox press if answer pressed has no sub_question
- should log event CulturalSurveyScrolledToBottom when user reach end of screen

