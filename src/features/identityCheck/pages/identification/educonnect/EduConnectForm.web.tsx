import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { ErrorTrigger } from 'features/identityCheck/components/ErrorTrigger'
import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { useEduConnectLoginMutation } from 'features/identityCheck/queries/useEduConnectLoginMutation'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { Typo } from 'ui/theme'

export const EduConnectForm = () => {
  const { error, openEduConnectTab } = useEduConnectLoginMutation()

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
          <Container>
            <Center>
              <IdCardWithMagnifyingGlass />
            </Center>
            <StyledButtonText>Identification</StyledButtonText>
            <StyledBody>
              Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de
              ton identifiant et ton mot de passe EduConnect&nbsp;! Si tu ne les as pas, contacte
              ton établissement pour les récupérer.
            </StyledBody>
            <Banner label="Un souci pour accéder à la page&nbsp;? Essaie en navigation privée ou pense bien à accepter les pop-ups de ton navigateur." />
          </Container>
        }
        fixedBottomChildren={
          <Button
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

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))
const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const Center = styled.View(({ theme }) => ({
  alignSelf: 'center',
  padding: theme.designSystem.size.spacing.xxl,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))

const StyledButtonText = styled(Typo.BodyAccent)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))
