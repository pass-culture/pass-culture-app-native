import React, { FunctionComponent, useEffect } from 'react'
import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { amplitude } from 'libs/amplitude'
import { AccessibilityList } from 'ui/components/accessibility/AccessibilityList'
import { BicolorEarth } from 'ui/svg/icons/BicolorEarth'
import { BicolorFrance } from 'ui/svg/icons/BicolorFrance'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectIDOrigin: FunctionComponent = () => {
  useEffect(() => {
    amplitude.logEvent('screen_view_select_id_origin')
  }, [])
  return <PageWithHeader title={'Identification'} scrollChildren={<SelectIDOriginContent />} />
}

const buttonList = [
  <HeroButtonList
    Title={
      <Text>
        <Typo.Body>J’ai une carte d’identité ou un passeport </Typo.Body>
        <Typo.ButtonText>français</Typo.ButtonText>
      </Text>
    }
    icon={BicolorFrance}
    navigateTo={{ screen: Platform.OS === 'web' ? 'SelectPhoneStatus' : 'SelectIDStatus' }}
    key={1}
  />,
  <HeroButtonList
    Title={
      <Text>
        <Typo.Body>J’ai une carte d’identité, un passeport </Typo.Body>
        <Typo.ButtonText>étranger </Typo.ButtonText>
        <Typo.Body>ou un titre de séjour français</Typo.Body>
      </Text>
    }
    icon={BicolorEarth}
    navigateTo={{ screen: 'DMSIntroduction', params: { isForeignDMSInformation: true } }}
    key={2}
  />,
]

const buttonListSeparator = <Spacer.Column numberOfSpaces={6} />

const SelectIDOriginContent: FunctionComponent = () => {
  return (
    <Container>
      <StyledBicolorIdCardWithMagnifyingGlass />
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle4>Munis-toi de ta pièce d’identité et débloque ton crédit&nbsp;!</StyledTitle4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>Pour cela, nous avons besoin de vérifier ton identité.</StyledBody>
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

const StyledBicolorIdCardWithMagnifyingGlass = styled(BicolorIdCardWithMagnifyingGlass).attrs(
  ({ theme }) => ({
    size: theme.illustrations.sizes.fullPage,
  })
)``

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})
const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
