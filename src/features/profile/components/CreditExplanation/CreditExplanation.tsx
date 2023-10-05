import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DomainsCredit } from 'api/gen'
import { ExhaustedCreditModal } from 'features/profile/components/Modals/ExhaustedCreditModal'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { analytics } from 'libs/analytics'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Question } from 'ui/svg/icons/Question'
import { Spacer } from 'ui/theme'

interface Props {
  domainsCredit: DomainsCredit
  isDepositExpired: boolean
}

export const CreditExplanation: FunctionComponent<Props> = ({
  domainsCredit,
  isDepositExpired,
}) => {
  const { visible, showModal, hideModal } = useModal(false)

  if (isDepositExpired) {
    const onPressExplanationButton = () => {
      showModal()
      analytics.logConsultModalExpiredGrant()
    }
    return (
      <React.Fragment>
        <StyledButtonQuaternaryBlack
          icon={Question}
          wording={'Mon crédit est expiré, que\u00a0faire\u00a0?'}
          onPress={onPressExplanationButton}
        />
        <ExpiredCreditModal visible={visible} hideModal={hideModal} />
      </React.Fragment>
    )
  }
  if (domainsCredit.all.remaining === 0) {
    const onPressExplanationButton = () => {
      showModal()
      analytics.logConsultModalNoMoreCredit()
    }
    return (
      <React.Fragment>
        <StyledButtonQuaternaryBlack
          icon={Question}
          wording={'J’ai dépensé tout mon crédit, que\u00a0faire\u00a0?'}
          onPress={onPressExplanationButton}
        />
        <ExhaustedCreditModal visible={visible} hideModal={hideModal} />
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={3} />
      <GreySeparator />
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        as={StyledButtonQuaternaryBlack}
        icon={Question}
        wording={'Comment ça marche\u00a0?'}
        navigateTo={{ screen: 'ProfileTutorialAgeInformation', params: { age: 18 } }}
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

const GreySeparator = styled(Separator).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))``
