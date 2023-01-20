import React, { FunctionComponent, useEffect } from 'react'
import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { amplitude } from 'libs/amplitude'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
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

const SelectIDOriginContent: FunctionComponent = () => {
  return (
    <Container>
      <StyledIconContainer>
        <StyledBicolorIdCardWithMagnifyingGlass />
      </StyledIconContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle4>Munis-toi de ta pièce d’identité et débloque ton crédit&nbsp;!</StyledTitle4>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>Pour cela, nous avons besoin de vérifier ton identité.</StyledBody>
      <Spacer.Column numberOfSpaces={8} />
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
        accessibilityLabel="J’ai une carte d’identité ou un passeport français"
      />
      <Spacer.Column numberOfSpaces={7} />
      <SeparatorWithText label="ou" />
      <Spacer.Column numberOfSpaces={7} />
      <SecondButtonList
        label="J’ai un titre de séjour, une carte d’identité ou un passeport étranger."
        leftIcon={BicolorEarth}
        navigateTo={{ screen: 'DMSIntroduction', params: { isForeignDMSInformation: true } }}
      />
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})
const StyledIconContainer = styled.View({
  alignItems: 'center',
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
