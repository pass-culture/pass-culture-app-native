import React, { FunctionComponent } from 'react'

import { DomainsCredit } from 'api/gen'
import { getCreditModal } from 'features/profile/components/CreditExplanation/getCreditModal'
import { ButtonQuaternary } from 'ui/components/buttons/ButtonQuaternary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'

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
      <StyledButtonQuaternary
        icon={InfoPlain}
        wording={buttonTitle}
        onPress={showModal}
        testID="explanationButton"
      />
      <CreditModal visible={visible} hideModal={hideModal} domainsCredit={props.domainsCredit} />
    </React.Fragment>
  )
}

const StyledButtonQuaternary = styledButton(ButtonQuaternary)({
  justifyContent: 'flex-start',
})
