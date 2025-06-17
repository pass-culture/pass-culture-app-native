import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { useEduConnectLogin } from 'features/identityCheck/api/useEduConnectLogin'
import { ErrorTrigger } from 'features/identityCheck/components/ErrorTrigger'
import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const EduConnectForm = () => {
  const { error, openEduConnectTab } = useEduConnectLogin()

  useEffect(() => {
    openEduConnectTab()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    throw error
  }

  return (
    <ErrorBoundary FallbackComponent={EduConnectErrorBoundary}>
      <PageWithHeader
        title="Mon identité"
        scrollChildren={
          <React.Fragment>
            <Center>
              <IdCardWithMagnifyingGlass />
            </Center>

            <StyledButtonText>Identification</StyledButtonText>

            <Spacer.Column numberOfSpaces={4} />

            <StyledBody>
              Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de
              ton identifiant et ton mot de passe EduConnect&nbsp;! Si tu ne les as pas, contacte
              ton établissement pour les récupérer.
            </StyledBody>

            <Spacer.Column numberOfSpaces={4} />

            <InfoBanner
              icon={Info}
              message="Un souci pour accéder à la page&nbsp;? Essaie en navigation privée ou pense bien à accepter les pop-ups de ton navigateur."
            />

            <Spacer.Column numberOfSpaces={8} />
          </React.Fragment>
        }
        fixedBottomChildren={
          <ButtonPrimary
            wording="Ouvrir un onglet ÉduConnect"
            onPress={openEduConnectTab}
            icon={ExternalSite}
          />
        }
      />
      <ErrorTrigger error={error} />
    </ErrorBoundary>
  )
}

const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const Center = styled.View({
  alignSelf: 'center',
  padding: getSpacing(7),
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))

const StyledButtonText = styled(Typo.BodyAccent)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))
