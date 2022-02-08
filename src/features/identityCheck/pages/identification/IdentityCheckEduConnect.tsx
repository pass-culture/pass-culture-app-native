import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { useEduConnectLogin } from 'features/identityCheck/utils/useEduConnectLogin'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Spacer, Typo } from 'ui/theme'

export const IdentityCheckEduConnect = () => {
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch } = useIdentityCheckContext()
  const { goBack } = useGoBack(...homeNavConfig)

  const { error, openEduConnect } = useEduConnectLogin()

  const onGoBack = () => {
    dispatch({ type: 'SET_METHOD', payload: null })
    goBack()
  }

  const onSubmit = () => {
    navigateToNextScreen()
    openEduConnect().catch((err) => {
      throw err
    })
  }

  useEnterKeyAction(onSubmit)

  if (error) {
    throw error
  }

  return (
    <PageWithHeader
      title={t`Identification`}
      onGoBack={onGoBack}
      scrollChildren={
        <Container>
          <Center>
            <Spacer.Column numberOfSpaces={10} />
            <StyledBicolorIdCardWithMagnifyingGlass />
          </Center>

          <CenteredTitle title={t`Identification`} />

          <Spacer.Column numberOfSpaces={4} />

          <TextContent>
            {t`Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de ton identifiant et ton mot de passe EduConnect\u00a0! Si tu ne les as pas, contacte ton établissement pour les récupérer.`}
          </TextContent>

          <Spacer.Column numberOfSpaces={8} />
        </Container>
      }
      fixedBottomChildren={
        <ButtonPrimary wording={`Connexion avec ÉduConnect`} onPress={onSubmit} />
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
const TextContent = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
