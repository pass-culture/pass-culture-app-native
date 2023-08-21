import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import {
  OnboardingRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { AgeSeparator } from 'features/onboarding/components/AgeSeparator'
import { CreditBlock } from 'features/onboarding/components/CreditBlock'
import { CreditBlockTitle } from 'features/onboarding/helpers/CreditBlockTitle'
import { getCreditStatusFromAge } from 'features/onboarding/helpers/getCreditStatusFromAge'
import { OnboardingPage } from 'features/onboarding/pages/OnboardingPage'
import { analytics } from 'libs/analytics'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AgeInformationProps = StackScreenProps<OnboardingRootStackParamList, 'AgeInformation'>

const logTrySelectDeposit = (age: number) => {
  analytics.logTrySelectDeposit(age)
}

const onSignupPress = () => {
  analytics.logOnboardingAgeInformationClicked({ type: 'account_creation' })
  analytics.logSignUpClicked({ from: 'onboarding' })
}

export const AgeInformation = ({ route }: AgeInformationProps): React.JSX.Element => {
  const { reset } = useNavigation<UseNavigationType>()
  const userAge = route.params.age
  const isEighteen = userAge === 18
  const {
    fifteenYearsOldDeposit,
    sixteenYearsOldDeposit,
    seventeenYearsOldDeposit,
    eighteenYearsOldDeposit,
  } = useDepositAmountsByAge()

  const underageInfo: { age: number; deposit: string }[] = [
    { age: 15, deposit: fifteenYearsOldDeposit },
    { age: 16, deposit: sixteenYearsOldDeposit },
    { age: 17, deposit: seventeenYearsOldDeposit },
  ]
  const eighteenYearOldInfo = { age: 18, deposit: eighteenYearsOldDeposit }

  const onLaterPress = () => {
    analytics.logOnboardingAgeInformationClicked({ type: 'account_creation_skipped' })
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  const buttons = [
    <InternalTouchableLink
      key={1}
      as={ButtonWithLinearGradient}
      wording="Créer un compte"
      onBeforeNavigate={onSignupPress}
      navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
    />,
    <InternalTouchableLink
      key={2}
      as={ButtonTertiaryBlack}
      wording="Plus tard"
      icon={ClockFilled}
      onBeforeNavigate={onLaterPress}
      navigateTo={navigateToHomeConfig}
      // We disable navigation because we reset the navigation before,
      // but we still want to use a link (not just a button) for accessibility reason
      enableNavigate={false}
      fullWidth
    />,
  ]

  return (
    <OnboardingPage
      title={`À ${userAge} ans, profite de ton pass Culture\u00a0!`}
      buttons={buttons}>
      <Typo.Title4 {...getHeadingAttrs(2)}>Comment ça marche&nbsp;?</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Container reverse={isEighteen}>
        <View>
          {underageInfo.map(({ age, deposit }) => (
            <React.Fragment key={age}>
              <CreditBlock
                creditStatus={getCreditStatusFromAge(userAge, age)}
                title={<CreditBlockTitle age={age} userAge={userAge} deposit={deposit} />}
                age={age}
                onPress={() => logTrySelectDeposit(age)}
              />
              <Spacer.Column numberOfSpaces={2} />
            </React.Fragment>
          ))}
        </View>
        <Container reverse={isEighteen}>
          <AgeSeparator isEighteen={isEighteen} />
          <CreditBlock
            creditStatus={getCreditStatusFromAge(userAge, eighteenYearOldInfo.age)}
            title={
              <CreditBlockTitle
                age={eighteenYearOldInfo.age}
                userAge={userAge}
                deposit={eighteenYearOldInfo.deposit}
              />
            }
            age={eighteenYearOldInfo.age}
            description={`Tu auras 2 ans pour utiliser tes ${eighteenYearOldInfo.deposit}`}
            onPress={() => logTrySelectDeposit(eighteenYearOldInfo.age)}
          />
        </Container>
      </Container>
    </OnboardingPage>
  )
}

const Container = styled.View<{ reverse: boolean }>(({ reverse }) => ({
  flexDirection: reverse ? 'column-reverse' : 'column',
}))
