import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { useEduConnectLogin } from 'features/identityCheck/api/useEduConnectLogin'
import { ErrorTrigger } from 'features/identityCheck/atoms/ErrorTrigger'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityCheckEduConnectForm = () => {
  const { error, openEduConnect } = useEduConnectLogin()

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
              <StyledBicolorIdCardWithMagnifyingGlass />
            </Center>

            <StyledButtonText>Identification</StyledButtonText>

            <Spacer.Column numberOfSpaces={4} />

            <StyledBody>
              Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de
              ton identifiant et ton mot de passe EduConnect&nbsp;! Si tu ne les as pas, contacte
              ton établissement pour les récupérer.
            </StyledBody>

            <Spacer.Column numberOfSpaces={4} />

            <HavingTroubleContainer>
              <Info />
              <Spacer.Row numberOfSpaces={2} />
              <Typo.CaptionNeutralInfo>
                Un souci pour accéder à la page&nbsp;? Essaie en navigation privée ou pense bien à
                accepter les pop-ups de ton navigateur.
              </Typo.CaptionNeutralInfo>
            </HavingTroubleContainer>

            <Spacer.Column numberOfSpaces={8} />
          </React.Fragment>
        }
        fixedBottomChildren={
          <ButtonPrimary
            wording="Ouvrir un onglet ÉduConnect"
            onPress={openEduConnect}
            icon={ExternalSite}
          />
        }
      />
      <ErrorTrigger error={error} />
    </ErrorBoundary>
  )
}

const StyledBicolorIdCardWithMagnifyingGlass = styled(BicolorIdCardWithMagnifyingGlass).attrs(
  ({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
  })
)``

const Center = styled.View({
  alignSelf: 'center',
  padding: getSpacing(7),
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))

const HavingTroubleContainer = styled.View(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(4),
  borderRadius: theme.borderRadius.checkbox,
}))
