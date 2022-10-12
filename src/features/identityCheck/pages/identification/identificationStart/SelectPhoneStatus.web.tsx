import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorNoPhone } from 'ui/svg/icons/BicolorNoPhone'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const SelectPhoneStatus: FunctionComponent = () => {
  return <PageWithHeader title={'Identification'} scrollChildren={<SelectPhoneStatusContent />} />
}

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
      <StyledVerticalUl>
        <Li>
          <HeroButtonList
            Title={<Typo.Body>J’ai un smartphone à proximité</Typo.Body>}
            icon={BicolorSmartphone}
            navigateTo={{ screen: 'SelectIDStatus' }}
          />
        </Li>
        <Spacer.Column numberOfSpaces={6} />
        <Li>
          <HeroButtonList
            Title={<Typo.Body>Je n’ai pas de smartphone à proximité</Typo.Body>}
            icon={BicolorNoPhone}
            navigateTo={{ screen: 'DMSIntroduction', params: { isForeignDMSInformation: false } }}
          />
        </Li>
      </StyledVerticalUl>
    </Container>
  )
}

const StyledVerticalUl = styled(VerticalUl)({
  width: '100%',
})

const Container = styled.View({
  height: '100%',
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const StyledBicolorPhonePending = styled(BicolorPhonePending).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
