import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { QFBonificationStatus } from 'api/gen'
import { BonificationType } from 'features/bonification/enums'
import { BonificationRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { CreditProgressBar } from 'features/profile/components/CreditInfo/CreditProgressBar'
import { BlockDescriptionItem } from 'features/profile/components/Tutorial/BlockDescriptionItem'
import { DashedStepContainer } from 'features/profile/components/Tutorial/DashedStepContainer'
import { PlainMoreSeparator } from 'features/profile/components/Tutorial/PlainMoreSeparator'
import { getBonificationButtonContent } from 'features/profile/helpers/getBonificationButtonContent'
import { UserProfile } from 'features/share/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { AccessibleUnorderedList } from 'ui/components/accessibility/AccessibleUnorderedList'
import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { Diagram } from 'ui/svg/icons/Diagram'
import { Lock } from 'ui/svg/icons/Lock'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

type Props = {
  amount: string
  isLoggedIn: boolean
  resetBannerVisibility: () => void
  user?: UserProfile
}

export const BonificationFamilyQuotientStep = ({
  amount,
  user,
  isLoggedIn,
  resetBannerVisibility,
}: Props) => {
  const disableQFBonificationButton = useFeatureFlag(
    RemoteStoreFeatureFlags.DISABLE_QF_BONIFICATION_MANUAL_REQUEST
  )
  const { designSystem } = useTheme()

  const { navigate } = useNavigation<UseNavigationType>()

  const bonificationStatus: QFBonificationStatus | null | undefined = user?.qfBonificationStatus

  const bonificationTooManyRetries = user?.remainingBonusAttempts === 0

  const isEligibleToBonification = bonificationStatus !== QFBonificationStatus.not_eligible

  const wasBonificationReceived = bonificationStatus === QFBonificationStatus.granted

  const showBonificationButton =
    isLoggedIn &&
    isEligibleToBonification &&
    !wasBonificationReceived &&
    !disableQFBonificationButton

  const bonificationButtonContent = getBonificationButtonContent(
    BonificationType.FAMILY_QUOTIENT,
    bonificationStatus
  )

  return (
    <React.Fragment>
      <PlainMoreSeparator />
      <InternalStep
        key="optional"
        variant={StepVariant.unknown}
        iconComponent={<GreyDiagram />}
        addMoreSpacingToIcons>
        <DashedStepContainer bonificationStatus={bonificationStatus}>
          <ViewGap gap={4}>
            <StyledBody>Bonus sous conditions</StyledBody>
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
              <ButtonContainerFlexStart>
                <Button
                  variant="tertiary"
                  color="neutral"
                  disabled={bonificationButtonContent.disabled}
                  icon={
                    bonificationStatus === QFBonificationStatus.started
                      ? ClockFilled
                      : PlainArrowNext
                  }
                  wording={bonificationButtonContent.label}
                  accessibilityLabel={bonificationButtonContent.accessibilityLabel}
                  onPress={() => {
                    if (bonificationTooManyRetries) {
                      navigate(
                        ...getSubscriptionHookConfig('BonificationRefused', {
                          bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES,
                        })
                      )
                    } else {
                      navigate(...getSubscriptionHookConfig('BonificationExplanations'))
                    }
                    resetBannerVisibility()
                  }}
                />
              </ButtonContainerFlexStart>
            ) : null}
          </ViewGap>
        </DashedStepContainer>
      </InternalStep>
    </React.Fragment>
  )
}

const PlusContainer = styled.View({
  width: '10%',
  alignItems: 'center',
  justifyContent: 'center',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledTitle3 = styled(Typo.Title3).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const GreyDiagram = styled(Diagram).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const SmallLock = styled(Lock).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const SmallConfirmation = styled(Confirmation).attrs(({ theme }) => ({
  size: theme.designSystem.size.icon.s,
}))``

const RowView = styled.View({
  flexDirection: 'row',
})

const Separator = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.l,
}))

const StyledPlus = styled(Typo.Title2).attrs(getNoHeadingAttrs)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))
