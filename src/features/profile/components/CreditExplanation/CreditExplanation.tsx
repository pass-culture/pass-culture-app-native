import React, { FunctionComponent } from 'react'

import { DomainsCredit } from 'api/gen'
import { getCreditModal } from 'features/profile/components/CreditExplanation/getCreditModal'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { Question } from 'ui/svg/icons/Question'

interface Props {
  domainsCredit: DomainsCredit
  isUserUnderageBeneficiary: boolean
  isDepositExpired: boolean
}

export const CreditExplanation: FunctionComponent<Props> = (props) => {
  const { visible, showModal, hideModal } = useModal(false)
  const { buttonTitle, creditModal: CreditModal } = getCreditModal(props)

  if (!buttonTitle || !CreditModal) {
    return null
  }

  return (
    <React.Fragment>
      <StyledButtonQuaternaryBlack
        icon={Question}
        wording={buttonTitle}
        onPress={showModal}
        testID="explanationButton"
      />
      <CreditModal visible={visible} hideModal={hideModal} domainsCredit={props.domainsCredit} />
    </React.Fragment>
  )
}

const StyledButtonQuaternaryBlack = styledButton(ButtonQuaternaryBlack).attrs({
  numberOfLines: 2,
  justifyContent: 'flex-start',
})({
  textAlign: 'left',
})
