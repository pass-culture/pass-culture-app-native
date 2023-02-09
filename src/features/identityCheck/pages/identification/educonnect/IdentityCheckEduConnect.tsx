import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { useEduConnectLogin } from 'features/identityCheck/api/useEduConnectLogin'
import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSubscriptionNavigation } from 'features/identityCheck/pages/helpers/useSubscriptionNavigation'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { amplitude } from 'libs/amplitude'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Spacer, Typo } from 'ui/theme'

export const IdentityCheckEduConnect = () => {
  const { navigateToNextScreen } = useSubscriptionNavigation()
  const { dispatch } = useSubscriptionContext()
  const { goBack } = useGoBack(...homeNavConfig)

  const { error, openEduConnectTab } = useEduConnectLogin()

  const onGoBack = () => {
    dispatch({ type: 'SET_METHOD', payload: null })
    goBack()
  }

  const onSubmit = () => {
    navigateToNextScreen()
    amplitude.logEvent('connect_with_Educonnect_clicked')
    if (Platform.OS === 'web') {
      openEduConnectTab()
    }
  }

  useEnterKeyAction(onSubmit)

  if (error) {
    throw error
  }

  return (
    <PageWithHeader
      title="Identification"
      onGoBack={onGoBack}
      scrollChildren={
        <Container>
          <Center>
            <Spacer.Column numberOfSpaces={10} />
            <StyledBicolorIdCardWithMagnifyingGlass />
          </Center>

          <CenteredTitle title="Identification" />

          <Spacer.Column numberOfSpaces={4} />

          <StyledBody>
            Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de
            ton identifiant et ton mot de passe EduConnect&nbsp;! Si tu ne les as pas, contacte ton
            établissement pour les récupérer.
          </StyledBody>

          <Spacer.Column numberOfSpaces={8} />
        </Container>
      }
      fixedBottomChildren={
        <ButtonPrimary wording="Connexion avec ÉduConnect" onPress={onSubmit} icon={ExternalSite} />
      }
    />
  )
}

const StyledBicolorIdCardWithMagnifyingGlass = styled(BicolorIdCardWithMagnifyingGlass).attrs(
  ({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
    color: theme.colors.secondary,
    color2: theme.colors.primary,
  })
)``

const Center = styled.View({ alignSelf: 'center' })

const Container = styled.View({ flexGrow: 1, justifyContent: 'center' })

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
