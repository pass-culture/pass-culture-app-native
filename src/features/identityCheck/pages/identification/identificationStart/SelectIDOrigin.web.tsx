import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { BicolorEarth } from 'ui/svg/icons/BicolorEarth'
import { BicolorFrance } from 'ui/svg/icons/BicolorFrance'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const SelectIDOrigin: FunctionComponent = () => {
  return <PageWithHeader title={'Identification'} scrollChildren={<SelectIDOriginContent />} />
}

const SelectIDOriginContent: FunctionComponent = () => {
  return (
    <Container>
      <StyledBicolorIdCardWithMagnifyingGlass />
      <Spacer.Column numberOfSpaces={4} />
      <StyledTitle>{t`Munis-toi de ta pièce d’identité et débloque ton crédit\u00a0!`}</StyledTitle>
      <Spacer.Column numberOfSpaces={4} />
      <StyledSubtitle>{t`Pour cela, nous avons besoin de vérifier ton identité.`}</StyledSubtitle>
      <Spacer.Column numberOfSpaces={8} />
      <HeroButtonList
        Title={
          <Text>
            <Typo.Body>{t`J’ai une carte d’identité ou un passeport` + ' '}</Typo.Body>
            <Typo.ButtonText>{t` français`}</Typo.ButtonText>
          </Text>
        }
        icon={BicolorFrance}
        onPress={() => {
          return
        }}
      />
      <Spacer.Column numberOfSpaces={6} />
      <HeroButtonList
        Title={
          <Text>
            <Typo.Body>{t`J’ai une carte d’identité, un passeport` + ' '}</Typo.Body>
            <Typo.ButtonText>{t`étranger` + ' '}</Typo.ButtonText>
            <Typo.Body>{t`ou un titre de séjour français`}</Typo.Body>
          </Text>
        }
        icon={BicolorEarth}
        onPress={() => {
          return
        }}
      />
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

const StyledTitle = styled(Typo.Title4)({
  textAlign: 'center',
})
const StyledSubtitle = styled(Typo.Body)({
  textAlign: 'center',
})
