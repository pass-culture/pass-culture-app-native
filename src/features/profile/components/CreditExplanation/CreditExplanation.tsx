import React, { FunctionComponent } from 'react'

import { DomainsCredit } from 'api/gen'
import { CreditCeilingsModal } from 'features/profile/components/Modals/CreditCeilingsModal'
import { ExhaustedCreditModal } from 'features/profile/components/Modals/ExhaustedCreditModal'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { analytics } from 'libs/analytics'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Question } from 'ui/svg/icons/Question'

interface Props {
  domainsCredit: DomainsCredit
  isDepositExpired: boolean
}

export const CreditExplanation: FunctionComponent<Props> = ({
  domainsCredit,
  isDepositExpired,
}) => {
  const { visible, showModal, hideModal } = useModal(false)
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()

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
  if (!isUserUnderageBeneficiary) {
    const onPressExplanationButton = () => {
      showModal()
      analytics.logConsultModalBeneficiaryCeilings()
    }
    return (
      <React.Fragment>
        <StyledButtonQuaternaryBlack
          icon={Question}
          wording={'Pourquoi cette limite\u00a0?'}
          onPress={onPressExplanationButton}
        />
        <CreditCeilingsModal
          visible={visible}
          hideModal={hideModal}
          domainsCredit={domainsCredit}
        />
      </React.Fragment>
    )
  }

  return null
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack).attrs({
  numberOfLines: 2,
  justifyContent: 'flex-start',
})({
  textAlign: 'left',
})
