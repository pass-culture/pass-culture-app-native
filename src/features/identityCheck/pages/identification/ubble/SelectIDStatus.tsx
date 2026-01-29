import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ApiError } from 'api/ApiError'
import { MaintenancePageType } from 'api/gen'
import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { useUbbleIdentificationMutation } from 'features/identityCheck/queries/useUbbleIdentificationMutation'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { HeroButtonListWithOnPress } from 'ui/components/buttons/HeroButtonListWithOnPress'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard as InitialIdCard } from 'ui/svg/icons/IdCard'
import { LostId as InitialLostId } from 'ui/svg/icons/LostId'
import { NoId as InitialNoId } from 'ui/svg/icons/NoId'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const SelectIDStatus: FunctionComponent = () => {
  const { data: subscription } = useGetStepperInfoQuery()
  const { navigate, replace } = useNavigation<UseNavigationType>()

  const { mutateAsync: mutateUbbleIdentification } = useUbbleIdentificationMutation()

  const onPress = async () => {
    try {
      const identificationSessionResponse = await mutateUbbleIdentification()

      navigate(
        ...getSubscriptionHookConfig('UbbleWebview', {
          identificationUrl: identificationSessionResponse.identificationUrl,
        })
      )
    } catch (err) {
      const error = (err as ApiError)?.content?.code
      if (error === 'IDCHECK_ALREADY_PROCESSED') {
        navigate(...getSubscriptionHookConfig('IdentityCheckPending'))
      } else {
        const withDMS = subscription?.maintenancePageType === MaintenancePageType['with-dms']
        replace(...getSubscriptionHookConfig('IdentityCheckUnavailable', { withDMS }))
      }
    }
  }

  return (
    <PageWithHeader
      title="Identification"
      scrollChildren={
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
          <HeroButtonListWithOnPress
            accessibilityLabel={accessibilityLabel}
            Title={<Typo.BodyAccent>{title}</Typo.BodyAccent>}
            Subtitle={<Typo.BodyAccentXs>{subtitle}</Typo.BodyAccentXs>}
            Icon={<IdCard />}
            onPress={onPress}
          />
          <Spacer.Column numberOfSpaces={7} />
          <SeparatorWithText label="ou" />
          <Spacer.Column numberOfSpaces={7} />
          <AccessibleUnorderedList
            items={[FirstOtherOption, SecondOtherOption]}
            Separator={buttonListSeparator}
            withPadding
          />
        </Container>
      }
    />
  )
}

const IdCard = styled(InitialIdCard).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const title = 'J’ai ma pièce d’identité en cours de validité'
const subtitle = 'Les copies ne sont pas acceptées'
const accessibilityLabel = getComputedAccessibilityLabel(title, subtitle)

const NoId = styled(InitialNoId).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const FirstOtherOption = (
  <SecondButtonList
    label="Je n’ai pas ma pièce d’identité originale avec moi"
    leftIcon={NoId}
    navigateTo={getSubscriptionPropConfig('ComeBackLater')}
  />
)

const LostId = styled(InitialLostId).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const SecondOtherOption = (
  <SecondButtonList
    label="Ma pièce d’identité est expirée ou perdue"
    leftIcon={LostId}
    navigateTo={getSubscriptionPropConfig('ExpiredOrLostID')}
  />
)

const buttonListSeparator = <Spacer.Column numberOfSpaces={9} />

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xs,
  marginVertical: theme.designSystem.size.spacing.xxl,
}))

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(2))({
  textAlign: 'center',
})

const StyledText = styled(Typo.Body)({
  textAlign: 'center',
})
