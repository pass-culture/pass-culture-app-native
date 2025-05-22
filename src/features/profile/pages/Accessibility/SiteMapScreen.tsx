import React from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { profileRoutes } from 'features/navigation/ProfileStackNavigator/profileRoutes'
import { ProfileStackRouteName } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { RootNavigateParams, ScreenNames } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'

type TabParamList = {
  Home: undefined
  SearchStackNavigator: { query?: string }
  Bookings: undefined
  Favorites: undefined
  Profile: undefined
}

type SubPage = {
  wording: string
  screen: ScreenNames
  params?: RootNavigateParams[1]
  isLoggedIn?: boolean
}

type SiteMap = {
  wording: string
  tabScreen: keyof TabParamList
  subPages: SubPage[]
  isLoggedIn?: boolean
}

const siteMapLinks: SiteMap[] = [
  { wording: 'Accueil', tabScreen: 'Home', subPages: [] },
  { wording: 'Recherche', tabScreen: 'SearchStackNavigator', subPages: [] },
  { wording: 'Réservations', tabScreen: 'Bookings', subPages: [], isLoggedIn: true },
  { wording: 'Favoris', tabScreen: 'Favorites', subPages: [], isLoggedIn: true },
  {
    wording: 'Profil',
    tabScreen: 'Profile',
    subPages: [
      { wording: 'Créer un compte', screen: 'SignupForm' },
      { wording: 'Se connecter', screen: 'Login' },
      { wording: 'Mes succès', screen: 'Achievements', isLoggedIn: true },
      { wording: 'Notifications', screen: 'NotificationsSettings' },
      { wording: 'Comment ça marche\u00a0?', screen: 'ProfileTutorialAgeInformationCredit' },
      { wording: 'Informations personnelles', screen: 'PersonalData', isLoggedIn: true },
      { wording: 'Préférence d’affichage', screen: 'DisplayPreference' },
      { wording: 'Accessibilité', screen: 'Accessibility' },
      { wording: 'Faire une suggestion', screen: 'FeedbackInApp' },
      { wording: 'Informations légales', screen: 'LegalNotices' },
      { wording: 'Confidentialité', screen: 'ConsentSettings' },
      { wording: 'Débuggage', screen: 'DisplayPreference', isLoggedIn: true },
    ],
  },
]

function isProfileRoute(screen: string): screen is ProfileStackRouteName {
  return profileRoutes.some((route) => route.name === screen)
}

export function SiteMapScreen() {
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))
  const { isLoggedIn } = useAuthContext()

  return (
    <SecondaryPageWithBlurHeader title="Plan du site" enableMaxWidth={false} onGoBack={goBack}>
      <VerticalUl>
        {siteMapLinks
          .filter(({ isLoggedIn: required }) => required === undefined || required === isLoggedIn)
          .map(({ wording, tabScreen, subPages }) => {
            const [screen, params] = getTabNavConfig(tabScreen)
            const filteredSubPages = subPages.filter(
              (subPage) => subPage.isLoggedIn === undefined || subPage.isLoggedIn === isLoggedIn
            )

            return (
              <BulletListItem
                key={wording}
                text={
                  <InternalTouchableLink
                    as={ButtonInsideTextBlack}
                    wording={wording}
                    navigateTo={{ screen, params }}
                  />
                }
                nestedListTexts={filteredSubPages.map(({ wording, screen: subscreen, params }) => {
                  const navigateTo = isProfileRoute(subscreen)
                    ? getProfileNavConfig(subscreen, params)
                    : { screen: subscreen as RootNavigateParams[0], params }

                  return (
                    <InternalTouchableLink
                      key={wording}
                      as={ButtonInsideTextBlack}
                      typography="BodyAccentXs"
                      wording={wording}
                      navigateTo={navigateTo}
                    />
                  )
                })}
              />
            )
          })}
      </VerticalUl>
    </SecondaryPageWithBlurHeader>
  )
}

const ButtonInsideTextBlack = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.designSystem.color.text.default,
}))``
