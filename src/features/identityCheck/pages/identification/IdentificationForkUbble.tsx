import React, { FunctionComponent, useEffect } from 'react'
import styled from 'styled-components/native'

import { IdentityCheckMethod } from 'api/gen'
import { IdentificationForkButton } from 'features/identityCheck/components/IdentificationForkButton'
import { JustifiedLeftTitle } from 'features/identityCheck/components/JustifiedLeftTitle'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { amplitude } from 'libs/amplitude'
import { env } from 'libs/environment'
import { theme } from 'theme'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Mariane } from 'ui/svg/icons/Mariane'
import { Ubble } from 'ui/svg/icons/Ubble'
import { getSpacing, Typo } from 'ui/theme'

export const IdentificationForkUbble: FunctionComponent = () => {
  useEffect(() => {
    amplitude.logEvent('screen_view_fork_ubble')
  }, [])

  return (
    <PageWithHeader title={'Identification'} scrollChildren={<IdentificationForkUbbleContent />} />
  )
}

const IdentificationForkUbbleContent: FunctionComponent = () => {
  return (
    <Container>
      <JustifiedLeftTitle title="S’identifier en 2 min avec&nbsp;:" />
      <IdentificationForkButton
        Title={<Typo.ButtonText>Ma pièce d’identité</Typo.ButtonText>}
        Subtitle={<StyledCaption>Carte d’identité ou passeport</StyledCaption>}
        icon={Ubble}
        navigateTo={{ screen: 'SelectIDOrigin' }}
        onBeforeNavigate={() =>
          amplitude.logEvent('choose_method_ubble', { fork_origin: IdentityCheckMethod.ubble })
        }
        key={0}
      />
      <StyledSeparatorWithText>
        <SeparatorWithText label="ou" />
      </StyledSeparatorWithText>
      <IdentificationForkButton
        Title={<Typo.ButtonText>Mes codes ÉduConnect</Typo.ButtonText>}
        Subtitle={<StyledCaption>Fournis par ton établissement scolaire</StyledCaption>}
        icon={Mariane}
        navigateTo={{ screen: 'IdentityCheckEduConnect' }}
        onBeforeNavigate={() =>
          amplitude.logEvent('choose_method_educonnect', { fork_origin: IdentityCheckMethod.ubble })
        }
        key={1}
      />
      <StyledExternalTouchableLinkContainer>
        <ExternalTouchableLink
          as={ButtonQuaternaryBlack}
          externalNav={{ url: env.FAQ_LINK_EDUCONNECT_URL }}
          onBeforeNavigate={() => {
            amplitude.logEvent('educonnect_explanation_clicked', {
              fork_origin: IdentityCheckMethod.ubble,
            })
          }}
          icon={InfoPlain}
          wording="C’est quoi ÉduConnect&nbsp;?"
          inline
        />
      </StyledExternalTouchableLinkContainer>
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

const StyledCaption = styled(Typo.Caption)({
  color: theme.colors.greyDark,
})
