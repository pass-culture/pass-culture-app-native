import { t } from '@lingui/macro'

import { Navigation } from 'features/cheatcodes/pages/Navigation'
import { FirstTutorial } from 'features/firstTutorial/pages/FirstTutorial/FirstTutorial'

import { Route } from './types'

export const routes: Route[] = [
  {
    name: 'FirstTutorial',
    component: FirstTutorial,
    path: 'introduction-tutoriel',
    options: { title: t`Étape 1 sur 4 | Tutoriel "Comment ça marche"` },
  },
  {
    name: 'Navigation',
    component: Navigation,
    path: 'cheat-navigation',
  },
]
