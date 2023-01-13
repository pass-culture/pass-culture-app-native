import React, { FunctionComponent, useEffect } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { amplitude } from 'libs/amplitude'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { Emoji } from 'ui/components/Emoji'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLostId } from 'ui/svg/icons/BicolorLostId'
import { BicolorNoId } from 'ui/svg/icons/BicolorNoId'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectIDStatus: FunctionComponent = () => {
  useEffect(() => {
    amplitude.logEvent('screen_view_select_id_status')
  }, [])
  return <PageWithHeader title="Identification" scrollChildren={<SelectIDStatusContent />} />
}

const MainOptionButton = (
  <HeroButtonList
    Title={
      <Text>
        <Typo.Body>J’ai ma pièce d’identité </Typo.Body>
        <Typo.ButtonText>en cours de validité avec moi</Typo.ButtonText>
      </Text>
    }
    Subtitle={
      <Typo.Caption>
        <Emoji.Warning withSpaceAfter />
        {'Les copies ne sont pas acceptées'}
      </Typo.Caption>
    }
    icon={BicolorIdCard}
    navigateTo={{ screen: 'UbbleWebview' }}
  />
)

const FirstOtherOption = (
  <SecondButtonList
    label="Je n’ai pas ma pièce d’identité originale avec moi"
    leftIcon={BicolorNoId}
    navigateTo={{ screen: 'ComeBackLater' }}
  />
)

const SecondOtherOption = (
  <SecondButtonList
    label="Ma pièce d’identité est expirée ou perdue"
    leftIcon={BicolorLostId}
    navigateTo={{ screen: 'ExpiredOrLostID' }}
  />
)

const buttonListSeparator = <Spacer.Column numberOfSpaces={9} />

const SelectIDStatusContent: FunctionComponent = () => {
  return (
    <Container>
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle4>As-tu ta pièce d’identité avec toi&nbsp;?</StyledTitle4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledText>
        <Typo.Body>Tu dois avoir ta pièce d’identité </Typo.Body>
        <Typo.ButtonText>originale </Typo.ButtonText>
        <Typo.Body>et </Typo.Body>
        <Typo.ButtonText>en cours de validité </Typo.ButtonText>
        <Typo.Body>avec toi.</Typo.Body>
      </StyledText>
      <Spacer.Column numberOfSpaces={12} />
      {MainOptionButton}
      <Spacer.Column numberOfSpaces={7} />
      <SeparatorWithText label="ou" />
      <Spacer.Column numberOfSpaces={7} />
      <AccessibilityList
        items={[FirstOtherOption, SecondOtherOption]}
        Separator={buttonListSeparator}
      />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'column',
  height: '100%',
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})
const StyledText = styled(Text)({
  textAlign: 'center',
})
