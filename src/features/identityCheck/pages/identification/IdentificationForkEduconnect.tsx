import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IdentificationForkButton } from 'features/identityCheck/components/IdentificationForkButton'
import { JustifiedLeftTitle } from 'features/identityCheck/components/JustifiedLeftTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { env } from 'libs/environment'
import { theme } from 'theme'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { OrSeparator } from 'ui/components/OrSeparator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Mariane } from 'ui/svg/icons/Mariane'
import { Ubble } from 'ui/svg/icons/Ubble'
import { getSpacing, Typo } from 'ui/theme'

export const IdentificationForkEduconnect: FunctionComponent = () => {
  return (
    <PageWithHeader
      title={'Identification'}
      scrollChildren={<IdentificationForkEduconnectContent />}
    />
  )
}

const IdentificationForkEduconnectContent: FunctionComponent = () => {
  return (
    <Container>
      <JustifiedLeftTitle title="S’identifier en 2 min avec&nbsp;:" />
      <IdentificationForkButton
        Title={<Typo.ButtonText>Mes codes ÉduConnect</Typo.ButtonText>}
        Subtitle={<StyledCaption>Fournis par ton établissement scolaire</StyledCaption>}
        icon={Mariane}
        navigateTo={{ screen: 'IdentityCheckEduConnect' }}
        key={0}
      />
      <StyledExternalTouchableLinkContainer>
        <ExternalTouchableLink
          as={ButtonQuaternaryBlack}
          externalNav={{ url: env.FAQ_LINK_EDUCONNECT_URL }}
          icon={InfoPlain}
          wording="C’est quoi ÉduConnect&nbsp;?"
          inline
        />
      </StyledExternalTouchableLinkContainer>
      <OrSeparator />
      <IdentificationForkButton
        Title={<Typo.ButtonText>Ma pièce d’identité</Typo.ButtonText>}
        Subtitle={<StyledCaption>Carte d’identité ou passeport</StyledCaption>}
        icon={Ubble}
        navigateTo={{ screen: 'SelectIDOrigin' }}
        key={1}
      />
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(3),
})

const StyledExternalTouchableLinkContainer = styled.View({
  alignItems: 'flex-start',
  marginTop: getSpacing(3),
})

const StyledCaption = styled(Typo.Caption)({
  color: theme.colors.greyDark,
})
