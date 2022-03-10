import { t } from '@lingui/macro'

import { NavigationCulturalSurvey } from 'features/cheatcodes/pages/NavigationCulturalSurvey/NavigationCulturalSurvey'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { withAsyncErrorBoundary } from 'features/errors'
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
    path: 'cultural-survey',
  },
  {
    name: 'CulturalSurveyIntro',
    component: CulturalSurveyIntro,
    path: 'cultural-survey-intro',
    options: { title: t`Prenons 1 minute` },
    secure: true,
  },
]
