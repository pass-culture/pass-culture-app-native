import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { BicolorNoPhone } from 'ui/svg/icons/BicolorNoPhone'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectPhoneStatus: FunctionComponent = () => {
  return <PageWithHeader title={'Identification'} scrollChildren={<SelectPhoneStatusContent />} />
}

const buttonList = [
  <HeroButtonList
    Title={<Typo.Body>J’ai un smartphone à proximité</Typo.Body>}
    icon={BicolorSmartphone}
    navigateTo={{ screen: 'SelectIDStatus' }}
    key={1}
  />,
  <HeroButtonList
    Title={<Typo.Body>Je n’ai pas de smartphone à proximité</Typo.Body>}
    icon={BicolorNoPhone}
    navigateTo={{ screen: 'DMSIntroduction', params: { isForeignDMSInformation: false } }}
    key={2}
  />,
]

const buttonListSeparator = <Spacer.Column numberOfSpaces={6} />

const SelectPhoneStatusContent: FunctionComponent = () => {
  return (
    <Container>
      <StyledBicolorPhonePending />
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle4>Vérifie ton identité avec un smartphone</StyledTitle4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>
        Gagne du temps en vérifiant ton identité sur un smartphone&nbsp;! Tu peux aussi passer par
        le site demarches-simplifiees.fr mais le traitement sera plus long.
      </StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <AccessibilityList items={buttonList} Separator={buttonListSeparator} />
    </Container>
  )
}

const Container = styled.View({
  height: '100%',
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
