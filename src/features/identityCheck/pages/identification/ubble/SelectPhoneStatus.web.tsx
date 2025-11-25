import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { NoPhone } from 'ui/svg/icons/NoPhone'
import { PhonePending as InitialPhonePending } from 'ui/svg/icons/PhonePending'
import { Smartphone } from 'ui/svg/icons/Smartphone'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectPhoneStatus: FunctionComponent = () => {
  return <PageWithHeader title="Identification" scrollChildren={<SelectPhoneStatusContent />} />
}

const SelectPhoneStatusContent: FunctionComponent = () => {
  const { designSystem } = useTheme()

  const buttonList = [
    <HeroButtonList
      Title={<Typo.Body>J’ai un smartphone à proximité</Typo.Body>}
      Icon={<Smartphone color={designSystem.color.icon.brandPrimary} />}
      navigateTo={getSubscriptionPropConfig('SelectIDStatus')}
      key={1}
    />,
    <HeroButtonList
      Title={<Typo.Body>Je n’ai pas de smartphone à proximité</Typo.Body>}
      Icon={<NoPhone color={designSystem.color.icon.brandPrimary} />}
      navigateTo={getSubscriptionPropConfig('DMSIntroduction', { isForeignDMSInformation: false })}
      key={2}
    />,
  ]

  return (
    <Container>
      <PhonePending />
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle4>Vérifie ton identité avec un smartphone</StyledTitle4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Gagne du temps en vérifiant ton identité sur un smartphone&nbsp;! Tu peux aussi passer par
        le site demarche.numerique.gouv.fr mais le traitement sera plus long.
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <AccessibleUnorderedList
        items={buttonList}
        Separator={<Spacer.Column numberOfSpaces={6} />}
      />
    </Container>
  )
}

const Container = styled.View({
  height: '100%',
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const PhonePending = styled(InitialPhonePending).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
