import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { BicolorEarth } from 'ui/svg/icons/BicolorEarth'
import { BicolorFrance } from 'ui/svg/icons/BicolorFrance'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const SelectIDOrigin: FunctionComponent = () => {
  return <PageWithHeader title={'Identification'} scrollChildren={<SelectIDOriginContent />} />
}

const SelectIDOriginContent: FunctionComponent = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Container>
      <StyledBicolorIdCardWithMagnifyingGlass />
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle4>Munis-toi de ta pièce d’identité et débloque ton crédit&nbsp;!</StyledTitle4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>Pour cela, nous avons besoin de vérifier ton identité.</StyledBody>
      <Spacer.Column numberOfSpaces={8} />
      <VerticalUl>
        <Li>
          <HeroButtonList
            Title={
              <Text>
                <Typo.Body>J’ai une carte d’identité ou un passeport </Typo.Body>
                <Typo.ButtonText>français</Typo.ButtonText>
              </Text>
            }
            icon={BicolorFrance}
            onPress={() => {
              navigate('SelectPhoneStatus')
            }}
          />
        </Li>
        <Spacer.Column numberOfSpaces={6} />
        <Li>
          <HeroButtonList
            Title={
              <Text>
                <Typo.Body>J’ai une carte d’identité, un passeport </Typo.Body>
                <Typo.ButtonText>étranger </Typo.ButtonText>
                <Typo.Body>ou un titre de séjour français</Typo.Body>
              </Text>
            }
            icon={BicolorEarth}
            onPress={() => {
              return
            }}
          />
        </Li>
      </VerticalUl>
    </Container>
  )
}

const Container = styled.View({
  height: '100%',
  alignItems: 'center',
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const StyledBicolorIdCardWithMagnifyingGlass = styled(BicolorIdCardWithMagnifyingGlass).attrs(
  ({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
  })
)``

const StyledTitle4 = styled(Typo.Title4)({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
