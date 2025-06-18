import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard as InitialIdCard } from 'ui/svg/icons/IdCard'
import { LostId as InitialLostId } from 'ui/svg/icons/LostId'
import { NoId as InitialNoId } from 'ui/svg/icons/NoId'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectIDStatus: FunctionComponent = () => (
  <PageWithHeader title="Identification" scrollChildren={<SelectIDStatusContent />} />
)

const IdCard = styled(InitialIdCard).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const MainOptionButton = (
  <HeroButtonList
    Title={<Typo.BodyAccent>J’ai ma pièce d’identité en cours de validité</Typo.BodyAccent>}
    Subtitle={<Typo.BodyAccentXs>Les copies ne sont pas acceptées</Typo.BodyAccentXs>}
    Icon={<IdCard />}
    navigateTo={{ screen: 'UbbleWebview' }}
  />
)

const NoId = styled(InitialNoId).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const FirstOtherOption = (
  <SecondButtonList
    label="Je n’ai pas ma pièce d’identité originale avec moi"
    leftIcon={NoId}
    navigateTo={{ screen: 'ComeBackLater' }}
  />
)

const LostId = styled(InitialLostId).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const SecondOtherOption = (
  <SecondButtonList
    label="Ma pièce d’identité est expirée ou perdue"
    leftIcon={LostId}
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
        <Typo.BodyAccent>originale </Typo.BodyAccent>
        <Typo.Body>et </Typo.Body>
        <Typo.BodyAccent>en cours de validité </Typo.BodyAccent>
        <Typo.Body>avec toi.</Typo.Body>
      </StyledText>
      <Spacer.Column numberOfSpaces={12} />
      {MainOptionButton}
      <Spacer.Column numberOfSpaces={7} />
      <SeparatorWithText label="ou" />
      <Spacer.Column numberOfSpaces={7} />
      <AccessibleUnorderedList
        items={[FirstOtherOption, SecondOtherOption]}
        Separator={buttonListSeparator}
      />
    </Container>
  )
}

const Container = styled.View({
  marginHorizontal: getSpacing(1),
  marginVertical: getSpacing(8),
})

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})

const StyledText = styled(Typo.Body)({
  textAlign: 'center',
})
