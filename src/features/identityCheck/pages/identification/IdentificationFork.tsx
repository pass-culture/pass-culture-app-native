import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { IdentificationForkButton } from 'features/identityCheck/components/IdentificationForkButton'
import { JustifiedLeftTitle } from 'features/identityCheck/components/JustifiedLeftTitle'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Marianne } from 'ui/svg/icons/Marianne'
import { Ubble } from 'ui/svg/icons/Ubble'
import { UbbleDark } from 'ui/svg/icons/UbbleDark'
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
  const {
    data: { shouldDisplayReassuranceMention },
  } = useRemoteConfigQuery()
  const { colorScheme } = useTheme()
  const isDarkMode = colorScheme === ColorScheme.DARK
  return (
    <Container>
      <JustifiedLeftTitle title="S’identifier en 2 min avec&nbsp;:" />
      <IdentificationForkButton
        Title={<Typo.BodyAccent>Mes codes ÉduConnect</Typo.BodyAccent>}
        Subtitle={<StyledCaption>Fournis par ton établissement scolaire</StyledCaption>}
        icon={Marianne}
        navigateTo={getSubscriptionPropConfig('EduConnectForm')}
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
        icon={isDarkMode ? UbbleDark : Ubble}
        navigateTo={getSubscriptionPropConfig('SelectIDOrigin')}
        onBeforeNavigate={analytics.logChooseUbbleMethod}
        key={1}
      />
      {shouldDisplayReassuranceMention ? (
        <BannerContainer>
          <Banner
            label="pass Culture collecte tes données personnelles pour s’assurer que tu es bien l’auteur de la demande. Tes données sont conservées 6 mois."
            links={[
              {
                wording: 'Voir la charte des données personnelles',
                externalNav: { url: env.PRIVACY_POLICY_LINK },
              },
            ]}
          />
        </BannerContainer>
      ) : null}
      <Spacer.Column numberOfSpaces={10} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: getSpacing(1),
  marginVertical: theme.designSystem.size.spacing.m,
}))

const BannerContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const StyledSeparatorWithText = styled.View({
  marginVertical: getSpacing(6),
})

const StyledExternalTouchableLinkContainer = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  marginTop: theme.designSystem.size.spacing.m,
}))

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
