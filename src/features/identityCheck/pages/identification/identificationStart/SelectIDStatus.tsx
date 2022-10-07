import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { Emoji } from 'ui/components/Emoji'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLostId } from 'ui/svg/icons/BicolorLostId'
import { BicolorNoId } from 'ui/svg/icons/BicolorNoId'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const SelectIDStatus: FunctionComponent = () => {
  return <PageWithHeader title="Identification" scrollChildren={<SelectIDStatusContent />} />
}

const FirstHeroButtonLink: FunctionComponent = () => {
  const subtitle = 'Les copies ne sont pas acceptées'
  return (
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
          {subtitle}
        </Typo.Caption>
      }
      icon={BicolorIdCard}
      // FIXME(PC-16835) navigate to ubble
      navigateTo={navigateToHomeConfig}
    />
  )
}

const SecondHeroButtonLink: FunctionComponent = () => {
  return (
    <HeroButtonList
      Title={
        <Text>
          <Typo.ButtonText>Je n’ai pas </Typo.ButtonText>
          <Typo.Body>ma pièce d’identité originale </Typo.Body>
          <Typo.ButtonText>avec moi</Typo.ButtonText>
        </Text>
      }
      icon={BicolorNoId}
      //FIXME(PC-16837) navigate to comebacklater page
      navigateTo={navigateToHomeConfig}
    />
  )
}

const ThirdHeroButtonLink: FunctionComponent = () => {
  return (
    <HeroButtonList
      Title={
        <Text>
          <Typo.Body>Ma pièce d’identité est </Typo.Body>
          <Typo.ButtonText>expirée ou perdue</Typo.ButtonText>
        </Text>
      }
      icon={BicolorLostId}
      //FIXME(PC-16839) navigate to expiredOrLostId page
      navigateTo={navigateToHomeConfig}
    />
  )
}

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
      <StyledVerticalUl>
        <Spacer.Column numberOfSpaces={12} />
        <Li>
          <FirstHeroButtonLink />
        </Li>
        <Spacer.Column numberOfSpaces={6} />
        <Li>
          <SecondHeroButtonLink />
        </Li>
        <Spacer.Column numberOfSpaces={6} />
        <Li>
          <ThirdHeroButtonLink />
        </Li>
      </StyledVerticalUl>
    </Container>
  )
}

const StyledVerticalUl = styled(VerticalUl)({
  width: '100%',
})

const Container = styled.View({
  flexDirection: 'column',
  height: '100%',
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})
const StyledText = styled(Text)({
  textAlign: 'center',
})
