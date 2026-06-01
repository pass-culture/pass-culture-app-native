import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { QFBonificationStatus } from 'api/gen'
import { BonificationRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { BlockDescriptionItem } from 'features/profile/components/Tutorial/BlockDescriptionItem'
import { DashedStepContainer } from 'features/profile/components/Tutorial/DashedStepContainer'
import { DefaultStepContainer } from 'features/profile/components/Tutorial/DefaultStepContainer'
import { PlainMoreSeparator } from 'features/profile/components/Tutorial/PlainMoreSeparator'
import { UserProfile } from 'features/share/types'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { Diagram } from 'ui/svg/icons/Diagram'
import { HandicapMotor } from 'ui/svg/icons/HandicapMotor'
import { Lock } from 'ui/svg/icons/Lock'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Warning } from 'ui/svg/icons/Warning'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Props = {
  amount: string
  isLoggedIn: boolean
  resetBannerVisibility: () => void
  user?: UserProfile
}

export const BonificationAllStep = ({ amount, isLoggedIn, resetBannerVisibility, user }: Props) => {
  const { designSystem } = useTheme()
  const { navigate } = useNavigation<UseNavigationType>()
  const bonificationStatus: QFBonificationStatus | null | undefined = user?.qfBonificationStatus
  const bonificationTooManyRetries = user?.remainingBonusAttempts === 0
  const isEligibleToBonification = bonificationStatus !== QFBonificationStatus.not_eligible
  const wasBonificationReceived = bonificationStatus === QFBonificationStatus.granted

  const getWording = (status: QFBonificationStatus | null | undefined): string => {
    switch (status) {
      case QFBonificationStatus.started:
        return 'En cours de traitement'
      case QFBonificationStatus.granted:
        return 'Bonus obtenu'
      default:
        return 'Faire une demande'
    }
  }

  const getDisabled = (status: QFBonificationStatus | null | undefined): boolean => {
    switch (status) {
      case QFBonificationStatus.started:
      case QFBonificationStatus.granted:
        return true
      default:
        return false
    }
  }

  const navigateToBonificationRefused = () => {
    navigate(
      ...getSubscriptionHookConfig('BonificationRefused', {
        bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES,
      })
    )
  }

  const navigateToBonificationExplanations = () => {
    navigate(...getSubscriptionHookConfig('BonificationExplanations'))
  }

  const onPressFamilyQuotientBonificationButton = () => {
    if (bonificationTooManyRetries) navigateToBonificationRefused()
    else navigateToBonificationExplanations()
    resetBannerVisibility()
  }

  const defaultDashedStepContainer = null
  const showBonificationButton = isLoggedIn && isEligibleToBonification && !wasBonificationReceived
  const iconBonificationButton =
    bonificationStatus === QFBonificationStatus.started ? ClockFilled : PlainArrowNext

  return (
    <React.Fragment>
      <PlainMoreSeparator />
      <InternalStep
        key="optional"
        variant={StepVariant.unknown}
        iconComponent={<GreyDiagram />}
        addMoreSpacingToIcons>
        <DefaultStepContainer>
          <StyledBody>Bonus sous conditions</StyledBody>
          <Container gap={3}>
            <Typo.Title3>
              Tu peux recevoir{SPACE}
              <StyledTitle3>{amount} supplémentaires</StyledTitle3>
            </Typo.Title3>
            <RowView>
              <CreditProgressBar progress={1} width="70%" />
              <PlusContainer>
                <StyledPlus>{'+'}</StyledPlus>
              </PlusContainer>
              <CreditProgressBar
                progress={1}
                width="20%"
                innerText={amount}
                color={designSystem.color.background.brandSecondary}
              />
            </RowView>
            <BlockDescriptionItem
              icon={<SmallWarning />}
              text="Tu ne peux pas cumuler les deux bonus"
            />
            <View>
              <DashedStepContainer bonificationStatus={bonificationStatus}>
                <BonficiationTitleContainer>
                  <StyledDiagram />
                  <Typo.Button>Quotient familial</Typo.Button>
                </BonficiationTitleContainer>
                <AccessibleUnorderedList
                  withPadding
                  Separator={<Separator />}
                  items={[
                    <BlockDescriptionItem
                      key={1}
                      icon={<SmallLock />}
                      text="Tu dois avoir débloqué le crédit de tes 18 ans."
                    />,
                    <BlockDescriptionItem
                      key={2}
                      icon={<SmallConfirmation />}
                      text="Le bonus dépend des ressources de ton foyer."
                    />,
                  ]}
                />
                {showBonificationButton ? (
                  <StyledButtonContainerFlexStart>
                    <Button
                      variant="tertiary"
                      color="neutral"
                      icon={iconBonificationButton}
                      wording={getWording(bonificationStatus)}
                      disabled={getDisabled(bonificationStatus)}
                      onPress={onPressFamilyQuotientBonificationButton}
                    />
                  </StyledButtonContainerFlexStart>
                ) : null}
              </DashedStepContainer>
              <SeparatorWithText label="ou" />
              <DashedStepContainer bonificationStatus={defaultDashedStepContainer}>
                <BonficiationTitleContainer>
                  <StyledHandicapMotor />
                  <Typo.Button>Situation de handicap</Typo.Button>
                </BonficiationTitleContainer>
                <AccessibleUnorderedList
                  withPadding
                  Separator={<Separator />}
                  items={[
                    <BlockDescriptionItem
                      key={1}
                      icon={<SmallLock />}
                      text="Tu dois avoir débloqué le crédit de tes 18 ans."
                    />,
                    <BlockDescriptionItem
                      key={2}
                      icon={<SmallConfirmation />}
                      text="Le bonus est réservé aux jeunes touchant l’AEEH ou l’AAH."
                    />,
                  ]}
                />
              </DashedStepContainer>
            </View>
          </Container>
        </DefaultStepContainer>
      </InternalStep>
    </React.Fragment>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledTitle3 = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const RowView = styled.View({
  flexDirection: 'row',
})

const StyledPlus = styled(Typo.Title2).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const PlusContainer = styled.View({
  width: '10%',
  alignItems: 'center',
  justifyContent: 'center',
})

const SmallWarning = styled(Warning).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const GreyDiagram = styled(Diagram).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const SmallConfirmation = styled(Confirmation).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const SmallLock = styled(Lock).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const Separator = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.l,
}))

const StyledButtonContainerFlexStart = styled(ButtonContainerFlexStart)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.m,
}))

const StyledHandicapMotor = styled(HandicapMotor).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.m,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledDiagram = styled(Diagram).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.m,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const BonficiationTitleContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.s,
}))
