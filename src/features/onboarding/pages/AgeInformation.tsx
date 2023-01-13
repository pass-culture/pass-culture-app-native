import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'features/auth/api/useDepositAmountsByAge'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import {
  OnboardingRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { AgeSeparator } from 'features/onboarding/components/AgeSeparator'
import { CreditBlock } from 'features/onboarding/components/CreditBlock'
import { getCreditStatusFromAge } from 'features/onboarding/helpers/getCreditStatusFromAge'
import { OnboardingPage } from 'features/onboarding/pages/OnboardingPage'
import { analytics } from 'libs/firebase/analytics'
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

export const AgeInformation = ({ route }: AgeInformationProps): JSX.Element => {
  const { reset } = useNavigation<UseNavigationType>()
  const userAge = route.params.age
  const isEighteen = userAge === 18
  const {
    fifteenYearsOldDeposit,
    sixteenYearsOldDeposit,
    seventeenYearsOldDeposit,
    eighteenYearsOldDeposit,
  } = useDepositAmountsByAge()

  const underageInfo: { age: number; deposit: string; position?: 'top' | 'bottom' }[] = [
    { age: 15, deposit: fifteenYearsOldDeposit, position: 'top' },
    { age: 16, deposit: sixteenYearsOldDeposit },
    { age: 17, deposit: seventeenYearsOldDeposit, position: 'bottom' },
  ]
  const eighteenYearOldInfo = { age: 18, deposit: eighteenYearsOldDeposit }

  const onLaterPress = () => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  const buttons = [
    <InternalTouchableLink
      key={1}
      as={ButtonWithLinearGradient}
      wording="Créer un compte"
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
          {underageInfo.map(({ age, deposit, position }, index) => (
            <React.Fragment key={index}>
              <CreditBlock
                underage
                creditStatus={getCreditStatusFromAge(userAge, age)}
                title={(index !== 0 ? '+ ' : '') + deposit}
                subtitle={`à ${age} ans`}
                roundedBorders={position}
                onPress={() => logTrySelectDeposit(age)}
              />
              <Spacer.Column numberOfSpaces={0.5} />
            </React.Fragment>
          ))}
        </View>
        <Container reverse={isEighteen}>
          <AgeSeparator isEighteen={isEighteen} />
          <CreditBlock
            underage={false}
            creditStatus={getCreditStatusFromAge(userAge, eighteenYearOldInfo.age)}
            title={eighteenYearOldInfo.deposit}
            subtitle={`à ${eighteenYearOldInfo.age} ans`}
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
