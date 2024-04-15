import React, { useReducer } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { SubscriptionCategoryButton } from 'features/subscription/components/buttons/SubscriptionCategoryButton'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OnboardingSubscription = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Home'))
  const headerHeight = useGetHeaderHeight()
  const { user } = useAuthContext()

  const initialSubscribedThemes: SubscriptionTheme[] = (user?.subscriptions?.subscribedThemes ??
    []) as SubscriptionTheme[]

  const [subscribedThemes, toggleSubscribedTheme] = useReducer(
    (state: SubscriptionTheme[], action: SubscriptionTheme) => {
      if (state.includes(action)) {
        return state.filter((theme) => theme !== action)
      }
      return [...state, action]
    },
    initialSubscribedThemes
  )

  const isThemeToggled = (theme: SubscriptionTheme) => subscribedThemes.includes(theme)

  const renderItem = ({ item }: { item: SubscriptionTheme }) => {
    return (
      <SubscriptionCategoryButtonContainer>
        <SubscriptionCategoryButton
          thematic={item}
          checked={isThemeToggled(item)}
          onPress={() => toggleSubscribedTheme(item)}
        />
      </SubscriptionCategoryButtonContainer>
    )
  }

  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title="" shouldDisplayBackButton />
      <StyledFlatList
        data={Object.values(SubscriptionTheme)}
        // @ts-ignore because of styled-components that doesn't pass the type
        renderItem={renderItem}
        keyExtractor={(item) => mapSubscriptionThemeToName[item as SubscriptionTheme]}
        numColumns={2}
        ListHeaderComponent={
          <React.Fragment>
            <Placeholder height={headerHeight} />
            <StyledTitle3>Choisis des thèmes à suivre</StyledTitle3>
            <Spacer.Column numberOfSpaces={4} />
            <Typo.Body>
              Tu recevras des notifs et/ou des mails pour ne rien rater des dernières sorties et
              actus&nbsp;!
            </Typo.Body>
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        }
        ListFooterComponent={
          <React.Fragment>
            <Spacer.Column numberOfSpaces={10} />
            <ButtonPrimary wording="Suivre la sélection" />
            <Spacer.Column numberOfSpaces={6} />
            <ButtonTertiaryBlack
              wording="Non merci"
              accessibilityLabel="Ne pas suivre de thème"
              icon={Invalidate}
              onPress={goBack}
            />
          </React.Fragment>
        }
      />

      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const StyledTitle3 = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const StyledFlatList = styled(FlatList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  },
}))``

const SubscriptionCategoryButtonContainer = styled.View(() => ({
  paddingHorizontal: getSpacing(5),
  paddingVertical: getSpacing(3),
  height: 172,
  flexBasis: '50%',
}))
