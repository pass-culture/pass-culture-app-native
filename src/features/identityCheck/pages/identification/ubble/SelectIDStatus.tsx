import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { analytics } from 'libs/analytics/provider'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorLostId } from 'ui/svg/icons/BicolorLostId'
import { BicolorNoId } from 'ui/svg/icons/BicolorNoId'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export enum IDStatus {
  'ID_OK' = 'id_ok',
  'NO_ID' = 'no_id',
  'EXPIRED_OR_LOST' = 'expired_or_lost',
}

const logEventSelectIdStatusClicked = (type: IDStatus) => {
  analytics.logSelectIdStatusClicked(type)
}

export const SelectIDStatus: FunctionComponent = () => (
  <PageWithHeader title="Identification" scrollChildren={<SelectIDStatusContent />} />
)

const MainOptionButton = (
  <HeroButtonList
    Title={<Typo.BodyAccent>J’ai ma pièce d’identité en cours de validité</Typo.BodyAccent>}
    Subtitle={<Typo.BodyAccentXs>Les copies ne sont pas acceptées</Typo.BodyAccentXs>}
    Icon={<BicolorIdCard />}
    navigateTo={{ screen: 'UbbleWebview' }}
    onBeforeNavigate={() => logEventSelectIdStatusClicked(IDStatus.ID_OK)}
  />
)

const FirstOtherOption = (
  <SecondButtonList
    label="Je n’ai pas ma pièce d’identité originale avec moi"
    leftIcon={BicolorNoId}
    navigateTo={{ screen: 'ComeBackLater' }}
    onBeforeNavigate={() => logEventSelectIdStatusClicked(IDStatus.NO_ID)}
  />
)

const SecondOtherOption = (
  <SecondButtonList
    label="Ma pièce d’identité est expirée ou perdue"
    leftIcon={BicolorLostId}
    navigateTo={{ screen: 'ExpiredOrLostID' }}
    onBeforeNavigate={() => logEventSelectIdStatusClicked(IDStatus.EXPIRED_OR_LOST)}
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
const StyledText = styled(Text)({
  textAlign: 'center',
})
