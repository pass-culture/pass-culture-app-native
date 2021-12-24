import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { Spacer, Typo, ColorsEnum, getSpacing } from 'ui/theme'

export const IdentityCheckEduConnect = () => {
  const { navigateToNextScreen } = useIdentityCheckNavigation()
  const { dispatch } = useIdentityCheckContext()
  const { goBack } = useGoBack(...homeNavConfig)

  const onGoBack = () => {
    dispatch({ type: 'SET_METHOD', payload: null })
    goBack()
  }

  useEnterKeyAction(navigateToNextScreen)

  return (
    <PageWithHeader
      title={t`Identification`}
      onGoBack={onGoBack}
      scrollChildren={
        <Container>
          <Center>
            <Spacer.Column numberOfSpaces={10} />
            <BicolorIdCardWithMagnifyingGlass
              color={ColorsEnum.SECONDARY}
              color2={ColorsEnum.PRIMARY}
              size={getSpacing(36)}
            />
          </Center>

          <CenteredTitle title={t`Identification`} />

          <Spacer.Column numberOfSpaces={4} />

          <TextContent color={ColorsEnum.GREY_DARK}>
            {t`Pour t'identifier, nous allons te demander de te connecter à ÉduConnect. Pense bien à avoir ton identifiant et ton mot de passe pour continuer. Si tu ne les as pas, contacte ton établissement pour les récupérer.`}
          </TextContent>

          <Spacer.Column numberOfSpaces={8} />
        </Container>
      }
      fixedBottomChildren={
        <ButtonPrimary title={`Connexion avec ÉduConnect`} onPress={navigateToNextScreen} />
      }
    />
  )
}

const Center = styled.View({ alignSelf: 'center' })
const TextContent = styled(Typo.Body)({ textAlign: 'center' })
const Container = styled.View({ flexGrow: 1, justifyContent: 'center' })
