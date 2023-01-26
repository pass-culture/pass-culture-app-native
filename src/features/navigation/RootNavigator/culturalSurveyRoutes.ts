import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { CulturalSurveyQuestions } from 'features/culturalSurvey/pages/CulturalSurveyQuestions'
import { CulturalSurveyThanks } from 'features/culturalSurvey/pages/CulturalSurveyThanks'
import { FAQWebview } from 'features/culturalSurvey/pages/FAQWebview'
import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { NavigationCulturalSurvey } from 'features/internal/cheatcodes/pages/NavigationCulturalSurvey/NavigationCulturalSurvey'
import {
  CulturalSurveyRootStackParamList,
  GenericRoute,
} from 'features/navigation/RootNavigator/types'

// Try to keep those routes in the same order as the user flow
export const culturalSurveyRoutes: GenericRoute<CulturalSurveyRootStackParamList>[] = [
  {
    name: 'NavigationCulturalSurvey',
    component: NavigationCulturalSurvey,
    hoc: withAsyncErrorBoundary,
    path: 'questionnaire-pratiques-initiales',
  },
  {
    name: 'CulturalSurveyIntro',
    component: CulturalSurveyIntro,
    path: 'questionnaire-pratiques-initiales/introduction',
    options: { title: 'Prenons 1 minute' },
    secure: true,
  },
  {
    name: 'CulturalSurveyQuestions',
    component: CulturalSurveyQuestions,
    path: 'questionnaire-pratiques-initiales/questions',
    secure: true,
  },
  {
    name: 'CulturalSurveyThanks',
    component: CulturalSurveyThanks,
    path: 'questionnaire-pratiques-initiales/merci',
    secure: true,
  },
  {
    name: 'FAQWebview',
    component: FAQWebview,
    path: 'questionnaire-pratiques-initiales/foire-aux-questions',
  },
]
