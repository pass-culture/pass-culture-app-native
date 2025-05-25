import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IdentificationForkButton } from 'features/identityCheck/components/IdentificationForkButton'
import { JustifiedLeftTitle } from 'features/identityCheck/components/JustifiedLeftTitle'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { theme } from 'theme'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuaternarySecondary'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Marianne } from 'ui/svg/icons/Marianne'
import { Ubble } from 'ui/svg/icons/Ubble'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const IdentificationFork: FunctionComponent = () => {
  return (
    <PageWithHeader
      title="Identification"
      scrollChildren={<IdentificationForkEduconnectContent />}
    />
  )
}

const IdentificationForkEduconnectContent: FunctionComponent = () => {
  const { shouldDisplayReassuranceMention } = useRemoteConfigQuery()
  return (
    <Container>
      <JustifiedLeftTitle title="S’identifier en 2 min avec&nbsp;:" />
      <IdentificationForkButton
        Title={<Typo.BodyAccent>Mes codes ÉduConnect</Typo.BodyAccent>}
        Subtitle={<StyledCaption>Fournis par ton établissement scolaire</StyledCaption>}
        icon={Marianne}
        navigateTo={{ screen: 'EduConnectForm' }}
        onBeforeNavigate={analytics.logChooseEduConnectMethod}
        key={0}
      />
      <StyledExternalTouchableLinkContainer>
        <ExternalTouchableLink
          as={ButtonQuaternaryBlack}
          externalNav={{ url: env.FAQ_LINK_EDUCONNECT_URL }}
          icon={ExternalSiteFilled}
          wording="C’est quoi ÉduConnect&nbsp;?"
          inline
        />
      </StyledExternalTouchableLinkContainer>
      <StyledSeparatorWithText>
        <SeparatorWithText label="ou" />
      </StyledSeparatorWithText>
      <IdentificationForkButton
        Title={<Typo.BodyAccent>Ma pièce d’identité</Typo.BodyAccent>}
        Subtitle={<StyledCaption>Carte d’identité ou passeport</StyledCaption>}
        icon={Ubble}
        navigateTo={{ screen: 'SelectIDOrigin' }}
        onBeforeNavigate={analytics.logChooseUbbleMethod}
        key={1}
      />
      {shouldDisplayReassuranceMention ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={2} />
          <InfoBanner message="pass Culture collecte tes données personnelles pour s’assurer que tu es bien l’auteur de la demande. Tes données sont conservées 6 mois.">
            <Spacer.Column numberOfSpaces={2} />
            <ExternalTouchableLink
              as={ButtonQuaternarySecondary}
              externalNav={{ url: env.PRIVACY_POLICY_LINK }}
              wording="Voir la charte des données personnelles"
              icon={ExternalSiteFilled}
              justifyContent="flex-start"
              inline
            />
          </InfoBanner>
        </React.Fragment>
      ) : null}
      <Spacer.Column numberOfSpaces={10} />
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(3),
})

const StyledSeparatorWithText = styled.View({
  marginVertical: getSpacing(6),
})

const StyledExternalTouchableLinkContainer = styled.View({
  alignItems: 'flex-start',
  marginTop: getSpacing(3),
})

const StyledCaption = styled(Typo.BodyAccentXs)({
  color: theme.colors.greyDark,
})
