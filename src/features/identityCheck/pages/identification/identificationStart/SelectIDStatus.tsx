import React, { FunctionComponent, useEffect } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { amplitude } from 'libs/amplitude'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { Emoji } from 'ui/components/Emoji'
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

const FirstHeroButtonLink = (
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

const SecondHeroButtonLink = (
  <HeroButtonList
    Title={
      <Text>
        <Typo.ButtonText>Je n’ai pas </Typo.ButtonText>
        <Typo.Body>ma pièce d’identité originale </Typo.Body>
        <Typo.ButtonText>avec moi</Typo.ButtonText>
      </Text>
    }
    icon={BicolorNoId}
    navigateTo={{ screen: 'ComeBackLater' }}
  />
)

const ThirdHeroButtonLink = (
  <HeroButtonList
    Title={
      <Text>
        <Typo.Body>Ma pièce d’identité est </Typo.Body>
        <Typo.ButtonText>expirée ou perdue</Typo.ButtonText>
      </Text>
    }
    icon={BicolorLostId}
    navigateTo={{ screen: 'ExpiredOrLostID' }}
  />
)

const buttonListSeparator = <Spacer.Column numberOfSpaces={6} />

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
      <AccessibilityList
        items={[FirstHeroButtonLink, SecondHeroButtonLink, ThirdHeroButtonLink]}
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
