import React, { useReducer } from 'react'
import { FlatList, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { SubscriptionCategoryButton } from 'features/subscription/components/buttons/SubscriptionCategoryButton'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { BlurHeader } from 'ui/components/headers/BlurHeader'
import { EmptyHeader } from 'ui/components/headers/EmpyHeader'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OnboardingSubscription = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Home'))
  const headerHeight = useGetHeaderHeight()
  const { user } = useAuthContext()
  const theme = useTheme()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

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

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: 'Tes préférences ont bien été enregistrées.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue, tu peux réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  )

  const isThemeToggled = (theme: SubscriptionTheme) => subscribedThemes.includes(theme)

  const isValidateButtonDisabled = subscribedThemes.length === 0 || isUpdatingProfile

  const renderItem = ({ item }: { item: SubscriptionTheme }) => {
    return (
      <SubscriptionCategoryButtonContainer key={item}>
        <SubscriptionCategoryButton
          thematic={item}
          checked={isThemeToggled(item)}
          onPress={() => toggleSubscribedTheme(item)}
        />
      </SubscriptionCategoryButtonContainer>
    )
  }

  const updateSubscription = () => {
    updateProfile({
      subscriptions: {
        marketingEmail: user?.subscriptions?.marketingEmail || false,
        marketingPush: user?.subscriptions?.marketingPush || false,
        subscribedThemes,
      },
    })
  }

  const contentContainerStyle: ViewStyle = {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginVertical,
    maxWidth: theme.contentPage.maxWidth,
    width: '100%',
    alignSelf: 'center',
  }

  return (
    <React.Fragment>
      <EmptyHeader />
      <FlatList
        data={Object.values(SubscriptionTheme)}
        renderItem={renderItem}
        keyExtractor={(item) => mapSubscriptionThemeToName[item]}
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
            <ButtonPrimary
              wording="Suivre la sélection"
              onPress={updateSubscription}
              disabled={isValidateButtonDisabled}
            />
            <Spacer.Column numberOfSpaces={6} />
            <ButtonTertiaryBlack
              wording="Non merci"
              accessibilityLabel="Ne pas suivre de thème"
              icon={Invalidate}
              onPress={goBack}
            />
          </React.Fragment>
        }
        contentContainerStyle={contentContainerStyle}
      />

      <BlurHeader height={headerHeight} />
    </React.Fragment>
  )
}

const StyledTitle3 = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))``

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
}))

const SubscriptionCategoryButtonContainer = styled.View(() => ({
  paddingHorizontal: getSpacing(5),
  paddingVertical: getSpacing(3),
  height: 172,
  flexBasis: '50%',
}))
