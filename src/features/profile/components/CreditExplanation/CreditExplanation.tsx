import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { analytics } from 'libs/analytics/provider'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Question } from 'ui/svg/icons/Question'
import { Spacer } from 'ui/theme'

interface Props {
  age: number
  isDepositExpired: boolean
}

export const CreditExplanation: FunctionComponent<Props> = ({ age, isDepositExpired }) => {
  const { visible, showModal, hideModal } = useModal(false)

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
        navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
        onBeforeNavigate={onTutorialClick}
      />
    </React.Fragment>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack).attrs({
  numberOfLines: 2,
  justifyContent: 'flex-start',
})(({ theme }) => ({
  textAlign: 'left',
  backgroundColor: theme.designSystem.color.background.default,
}))

const GreySeparator = styled(Separator.Horizontal).attrs(({ theme }) => ({
  // TODO(PC-36408): theme.designSystem.separator.default or subtle not visible in light mode because the parent background is grey
  color: theme.designSystem.color.border.default,
}))``
