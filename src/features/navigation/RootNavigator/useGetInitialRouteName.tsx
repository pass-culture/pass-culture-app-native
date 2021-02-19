import { useEffect, useState } from 'react'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'

export type InitialRouteName = 'TabNavigator' | 'FirstTutorial' | 'CulturalSurvey' | undefined

export function useGetInitialRouteName() {
  const [initialRouteName, setInitialRouteName] = useState<InitialRouteName>()
  const { isLoggedIn } = useAuthContext()

  async function getInitialRouteName(): Promise<InitialRouteName> {
    if (isLoggedIn) {
      const user = await api.getnativev1me()
      if (user.needsToFillCulturalSurvey) {
        return 'CulturalSurvey'
      }
    }

    const hasSeenTutorials = !!(await storage.readObject('has_seen_tutorials'))
    if (hasSeenTutorials) {
      return 'TabNavigator'
    }

    return 'FirstTutorial'
  }

  useEffect(() => {
    getInitialRouteName().then((routeName) => {
      setInitialRouteName(routeName)
      triggerInitialRouteNameAnalytics(routeName)
    })
  }, [])

  return initialRouteName
}

function triggerInitialRouteNameAnalytics(routeName: InitialRouteName) {
  if (!routeName) {
    return
  }
  if (routeName === 'TabNavigator') {
    analytics.logScreenView('Home')
  } else {
    analytics.logScreenView(routeName)
  }
}
