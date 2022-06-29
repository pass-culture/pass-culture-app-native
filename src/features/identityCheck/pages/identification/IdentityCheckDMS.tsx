import { t } from '@lingui/macro'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { OrSeparator } from 'ui/components/OrSeparator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityCheckDMS = () => {
  const theme = useTheme()

  const onDMSFrenchCitizenPress = () => {
    analytics.logOpenDMSFrenchCitizenURL()
  }

  const onDMSForeignCitizenPress = () => {
    analytics.logOpenDMSForeignCitizenURL()
  }

  return (
    <PageWithHeader
      title={t`Identification`}
      fixedTopChildren={
        <Container>
          <Spacer.Column numberOfSpaces={5} />
          <StyledBicolorIdCardWithMagnifyingGlass />
          <Spacer.Column numberOfSpaces={5} />
          <CenteredTitle title={t`Créer un dossier sur le site des Démarches Simplifiées`} />
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>
            {t`La vérification de ton identité n’a pas pu aboutir. Tu peux créer un dossier sur le site des Démarches Simplifiées afin d’obtenir ton pass Cutlure.`}
          </StyledBody>
          {theme.isMobileViewport ? <Spacer.Flex /> : <Spacer.Column numberOfSpaces={5} />}
          <ButtonContainer>
            <TouchableLink
              as={ButtonTertiaryBlack}
              wording={t`Je suis de nationalité française`}
              externalNav={{ url: env.DMS_FRENCH_CITIZEN_URL }}
              onPress={onDMSFrenchCitizenPress}
              icon={ExternalSiteFilled}
            />
            <Caption>{t`Carte d’identité ou passeport.`}</Caption>
            <OrSeparator />
            <TouchableLink
              as={ButtonTertiaryBlack}
              wording={t`Je suis de nationalité étrangère`}
              externalNav={{ url: env.DMS_FOREIGN_CITIZEN_URL }}
              onPress={onDMSForeignCitizenPress}
              icon={ExternalSiteFilled}
            />
            <Caption>{t`Titre de séjour, carte d'identité ou passeport.`}</Caption>
          </ButtonContainer>
          <Spacer.BottomScreen />
        </Container>
      }
    />
  )
}

const StyledBicolorIdCardWithMagnifyingGlass = styled(BicolorIdCardWithMagnifyingGlass).attrs(
  ({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
  })
)``

const Container = styled.View({ height: '100%', alignItems: 'center' })

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
const ButtonContainer = styled.View({ padding: getSpacing(10) })

const Caption = styled(Typo.Caption)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
