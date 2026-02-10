import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { analytics } from 'libs/analytics/provider'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
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
        <ButtonContainerFlexStart>
          <Button
            variant="tertiary"
            color="neutral"
            icon={Question}
            numberOfLines={2}
            wording="Mon crédit est expiré, que&nbsp;faire&nbsp;?"
            onPress={onPressExplanationButton}
          />
        </ButtonContainerFlexStart>
        <ExpiredCreditModal visible={visible} hideModal={hideModal} />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <GreySeparator />
      <Spacer.Column numberOfSpaces={2.5} />
      <ButtonContainerFlexStart>
        <InternalTouchableLink
          as={Button}
          variant="tertiary"
          color="neutral"
          icon={Question}
          numberOfLines={2}
          wording="Comment ça marche&nbsp;?"
          navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
          onBeforeNavigate={onTutorialClick}
        />
      </ButtonContainerFlexStart>
    </React.Fragment>
  )
}

const GreySeparator = styled(Separator.Horizontal).attrs(({ theme }) => ({
  // TODO(PC-36408): theme.designSystem.separator.default or subtle not visible in light mode because the parent background is grey
  color: theme.designSystem.color.border.default,
}))``
