import { t } from '@lingui/macro'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { useEduConnectLogin } from 'features/identityCheck/api/useEduConnectLogin'
import { ErrorTrigger } from 'features/identityCheck/atoms/ErrorTrigger'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { EduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
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
        title={t`Mon identité`}
        scrollChildren={
          <React.Fragment>
            <Center>
              <StyledBicolorIdCardWithMagnifyingGlass />
            </Center>

            <JustifiedHeader>{t`Identification`}</JustifiedHeader>
            <Spacer.Column numberOfSpaces={4} />

            <JustifiedText>
              {t`Pour t’identifier, nous allons te demander de te connecter à EduConnect. Munis-toi de ton identifiant et ton mot de passe EduConnect\u00a0! Si tu ne les as pas, contacte ton établissement pour les récupérer.`}
            </JustifiedText>
            <Spacer.Column numberOfSpaces={4} />
            <HavingTroubleContainer>
              <Info />
              <Spacer.Row numberOfSpaces={2} />

              <GreyDarkCaption>
                {t`Un souci pour accéder à la page\u00a0? Essaie en navigation privée ou pense bien à accepter les pop-ups de ton navigateur.`}
              </GreyDarkCaption>
            </HavingTroubleContainer>

            <Spacer.Column numberOfSpaces={8} />
          </React.Fragment>
        }
        fixedBottomChildren={
          <ButtonPrimary
            wording={t`Ouvrir un onglet ÉduConnect`}
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

const JustifiedText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))

const JustifiedHeader = styled(Typo.ButtonText)(({ theme }) => ({
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
