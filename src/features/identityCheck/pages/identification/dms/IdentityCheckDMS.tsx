import React from 'react'
import styled from 'styled-components/native'

import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentityCheckDMS = () => {
  const onDMSFrenchCitizenPress = () => {
    analytics.logOpenDMSFrenchCitizenURL()
  }

  const onDMSForeignCitizenPress = () => {
    analytics.logOpenDMSForeignCitizenURL()
  }

  return (
    <PageWithHeader
      title="Identification"
      scrollChildren={
        <Container>
          <Spacer.Column numberOfSpaces={5} />
          <IdCardWithMagnifyingGlass />
          <Spacer.Column numberOfSpaces={5} />
          <CenteredTitle title="Créer un dossier sur le site Démarche Numérique" />
          <Spacer.Column numberOfSpaces={5} />
          <StyledBody>
            La vérification de ton identité n’a pas pu aboutir. Tu peux créer un dossier sur le site
            Démarche Numérique afin d’obtenir ton pass Culture.
          </StyledBody>

          <ButtonContainer>
            <ExternalTouchableLink
              as={ButtonTertiaryBlack}
              wording="Je suis de nationalité française"
              externalNav={{ url: env.DMS_FRENCH_CITIZEN_URL }}
              onBeforeNavigate={onDMSFrenchCitizenPress}
              icon={ExternalSiteFilled}
            />
            <CaptionNeutralInfo>Carte d’identité ou passeport.</CaptionNeutralInfo>
            <StyledSeparatorWithText>
              <SeparatorWithText label="ou" />
            </StyledSeparatorWithText>
            <ExternalTouchableLink
              as={ButtonTertiaryBlack}
              wording="Je suis de nationalité étrangère"
              externalNav={{ url: env.DMS_FOREIGN_CITIZEN_URL }}
              onBeforeNavigate={onDMSForeignCitizenPress}
              icon={ExternalSiteFilled}
            />
            <CaptionNeutralInfo>Titre de séjour, carte d’identité ou passeport.</CaptionNeutralInfo>
          </ButtonContainer>
          <Spacer.BottomScreen />
        </Container>
      }
    />
  )
}

const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled.View({ height: '100%', alignItems: 'center' })

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))

const ButtonContainer = styled.View({ padding: getSpacing(10) })

const StyledSeparatorWithText = styled.View({
  marginVertical: getSpacing(6),
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))
