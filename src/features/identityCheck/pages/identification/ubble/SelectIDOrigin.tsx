import React, { FunctionComponent } from 'react'
import { Platform, Text } from 'react-native'
import styled from 'styled-components/native'

import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Earth as InitialEarth } from 'ui/svg/icons/Earth'
import { France as FranceIcon } from 'ui/svg/icons/France'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectIDOrigin: FunctionComponent = () => (
  <PageWithHeader title="Identification" scrollChildren={<SelectIDOriginContent />} />
)

const SelectIDOriginContent: FunctionComponent = () => {
  return (
    <Container>
      <StyledIconContainer>
        <IdCardWithMagnifyingGlass />
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
            <Typo.BodyAccent>français</Typo.BodyAccent>
          </Text>
        }
        Icon={<France />}
        navigateTo={getSubscriptionPropConfig(
          Platform.OS === 'web' ? 'SelectPhoneStatus' : 'SelectIDStatus'
        )}
        key={1}
        accessibilityLabel="J’ai une carte d’identité ou un passeport français"
      />
      <Spacer.Column numberOfSpaces={7} />
      <SeparatorWithText label="ou" />
      <Spacer.Column numberOfSpaces={7} />
      <SecondButtonList
        label="J’ai un titre de séjour, une carte d’identité ou un passeport étranger."
        leftIcon={Earth}
        navigateTo={getSubscriptionPropConfig('DMSIntroduction', { isForeignDMSInformation: true })}
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

const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const France = styled(FranceIcon).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const Earth = styled(InitialEarth).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
