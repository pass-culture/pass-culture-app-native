import React from 'react'
import { View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { DefaultTheme } from 'styled-components/dist/types'
import styled from 'styled-components/native'

import { QFBonificationStatus } from 'api/gen'
import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { DURATION_IN_MS, customEaseInOut } from 'features/onboarding/helpers/animationProps'
import { analytics } from 'libs/analytics/provider'
import { AnimatedView, NAV_DELAY_IN_MS } from 'libs/react-native-animatable'
import { bonificationAmountFallbackValue } from 'shared/credits/defaultCreditByAge'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useDepositAmountsByAge } from 'shared/user/useDepositAmountsByAge'
import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { CakeOneCandle } from 'ui/svg/icons/CakeOneCandle'
import { CakeTwoCandles } from 'ui/svg/icons/CakeTwoCandles'
import { Warning } from 'ui/svg/icons/Warning'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Age = 17 | 18

type CreditStep = 17 | 18 | 'information' | 'optional' | 'separator'

export type CreditComponentPropsV3 = {
  creditStep: CreditStep
  iconComponent?: React.JSX.Element
  bonificationStatus?: QFBonificationStatus | null
  children?: React.ReactNode
}

interface Props {
  age: Age
  stepperProps: CreditComponentPropsV3[]
  testID?: string
}

export const CreditTimelineV3 = ({ stepperProps, age, testID }: Props) => {
  const { seventeenYearsOldDeposit, eighteenYearsOldDeposit } = useDepositAmountsByAge()
  const { data: settings } = useSettingsContext()
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(
    settings?.bonification.bonusAmount || bonificationAmountFallbackValue,
    currency,
    euroToPacificFrancRate
  )

  const depositsByAge = new Map<Props['age'], string>([
    [17, seventeenYearsOldDeposit],
    [18, eighteenYearsOldDeposit],
  ])
  const SpaceBetweenBlock = 3

  return (
    <Container testID={testID}>
      {stepperProps.map((props, index) => {
        const isLast = index === stepperProps.length - 1
        const isFirst = index === 0
        if (props.creditStep === 'information') {
          const iconComponent = props.iconComponent ?? <GreyWarning />
          return (
            <InternalStep
              key={'information ' + index}
              variant={StepVariant.complete}
              isLast={isLast}
              iconComponent={iconComponent}
              addMoreSpacingToIcons>
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
              {props.children}
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
            </InternalStep>
          )
        }

        const containerAnimation = {
          from: { transform: [{ scale: 0.95 }] },
          to: { transform: [{ scale: 1 }] },
        }

        const animatedViewProps = {
          duration: DURATION_IN_MS,
          animation: containerAnimation,
          delay: NAV_DELAY_IN_MS,
          easing: customEaseInOut,
        }

        if (props.creditStep === 'separator') {
          return (
            <InternalStep key={'separator ' + index} variant={StepVariant.unknown}>
              <SeparatorStyledAnimatedView {...animatedViewProps}>
                <View>{props.children}</View>
              </SeparatorStyledAnimatedView>
            </InternalStep>
          )
        }
        if (props.creditStep === 'optional') {
          return (
            <InternalStep key={'optional ' + index} variant={StepVariant.unknown}>
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
              <DashedStyledView
                bonificationStatus={props.bonificationStatus}
                {...animatedViewProps}>
                <View>
                  <StyledBody>Bonus sous conditions</StyledBody>
                  <Spacer.Column numberOfSpaces={1} />
                  <StyledTitle3>
                    Tu peux recevoir{SPACE}
                    <TitleSecondary>{`${bonificationAmount} supplémentaires`}</TitleSecondary>
                  </StyledTitle3>
                  {props.children}
                </View>
              </DashedStyledView>
              <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
            </InternalStep>
          )
        }
        return (
          <InternalStep
            key={props.creditStep}
            variant={StepVariant.complete}
            iconComponent={props.creditStep === 17 ? <GreyCakeOneCandle /> : <GreyCakeTwoCandles />}
            isFirst={isFirst}
            isLast={isLast}
            addMoreSpacingToIcons>
            <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
            <TouchableWithoutFeedback onPress={() => analytics.logTrySelectDeposit(age)}>
              <StyledAnimatedView {...animatedViewProps}>
                <View>
                  <StyledBody>{`à ${props.creditStep} ans`}</StyledBody>
                  <Spacer.Column numberOfSpaces={1} />
                  <StyledTitle3>
                    Tu reçois{SPACE}
                    <TitleSecondary>{depositsByAge.get(props.creditStep) ?? ''}</TitleSecondary>
                  </StyledTitle3>
                  {props.children}
                </View>
              </StyledAnimatedView>
            </TouchableWithoutFeedback>
            <Spacer.Column numberOfSpaces={SpaceBetweenBlock} />
          </InternalStep>
        )
      })}
    </Container>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const GreyCakeOneCandle = styled(CakeOneCandle).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
}))``

const GreyCakeTwoCandles = styled(CakeTwoCandles).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.default,
}))``

const Container = styled.View({
  flexGrow: 1,
  flexDirection: 'column',
})

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.s,
}))

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))

const TitleSecondary = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledAnimatedView = styled(AnimatedView)(({ theme }) => ({
  borderColor: theme.designSystem.color.border.default,
  borderWidth: theme.designSystem.size.spacing.xxs,
  borderRadius: theme.designSystem.size.borderRadius.m,
  padding: theme.designSystem.size.spacing.l,
  overflow: 'hidden',
}))

const DashedStyledView = styled.View<{
  bonificationStatus: QFBonificationStatus | null | undefined
}>(({ theme, bonificationStatus }) => ({
  borderColor: theme.designSystem.color.border.brandPrimary,
  borderWidth: theme.designSystem.size.spacing.xxs,
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderStyle: 'dashed',
  padding: theme.designSystem.size.spacing.l,
  overflow: 'hidden',
  backgroundColor: getBackgroundColorByStatus(bonificationStatus, theme),
}))

const SeparatorStyledAnimatedView = styled(AnimatedView)(() => ({
  overflow: 'hidden',
  alignSelf: 'center',
}))

const getBackgroundColorByStatus = (
  status: QFBonificationStatus | null | undefined,
  theme: DefaultTheme
) => {
  switch (status) {
    case QFBonificationStatus.granted:
      return theme.designSystem.color.background.default
    case QFBonificationStatus.started:
      return theme.designSystem.color.background.disabled
    default:
      return theme.designSystem.color.background.info
  }
}
