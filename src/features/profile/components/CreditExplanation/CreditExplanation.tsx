import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useSettingsContext } from 'features/auth/context/SettingsContext'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { TutorialTypes } from 'features/tutorial/enums'
import { analytics } from 'libs/analytics/provider'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Question } from 'ui/svg/icons/Question'
import { Spacer } from 'ui/theme'

interface Props {
  age: number
  isDepositExpired: boolean
}

export const CreditExplanation: FunctionComponent<Props> = ({ age, isDepositExpired }) => {
  const { visible, showModal, hideModal } = useModal(false)
  const { data: settings } = useSettingsContext()
  const enableCreditV3 = settings?.wipEnableCreditV3

  const navigateTo15to18: InternalNavigationProps['navigateTo'] = enableCreditV3
    ? { screen: 'ProfileTutorialAgeInformationCreditV3' }
    : { screen: 'ProfileTutorialAgeInformation', params: { age } }
  const navigateToUnder15AndAbove18: InternalNavigationProps['navigateTo'] = enableCreditV3
    ? { screen: 'ProfileTutorialAgeInformationCreditV3' }
    : { screen: 'EligibleUserAgeSelection', params: { type: TutorialTypes.PROFILE_TUTORIAL } }
  const tutorialNavigateTo =
    age && age < 19 && age > 14 ? navigateTo15to18 : navigateToUnder15AndAbove18

  const onTutorialClick = () => analytics.logConsultTutorial({ age, from: 'CreditBlock' })

  if (isDepositExpired) {
    const onPressExplanationButton = () => {
      showModal()
      analytics.logConsultModalExpiredGrant()
    }
    return (
      <React.Fragment>
        <StyledButtonQuaternaryBlack
          icon={Question}
          wording="Mon crédit est expiré, que&nbsp;faire&nbsp;?"
          onPress={onPressExplanationButton}
        />
        <ExpiredCreditModal visible={visible} hideModal={hideModal} />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <GreySeparator />
      <Spacer.Column numberOfSpaces={2.5} />
      <InternalTouchableLink
        as={StyledButtonQuaternaryBlack}
        icon={Question}
        wording="Comment ça marche&nbsp;?"
        navigateTo={tutorialNavigateTo}
        onBeforeNavigate={onTutorialClick}
      />
    </React.Fragment>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack).attrs({
  numberOfLines: 2,
  justifyContent: 'flex-start',
})({
  textAlign: 'left',
})

const GreySeparator = styled(Separator.Horizontal).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))``
