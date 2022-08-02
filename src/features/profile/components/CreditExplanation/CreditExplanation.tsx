import React, { FunctionComponent } from 'react'

import { DomainsCredit } from 'api/gen'
import { getCreditModal } from 'features/profile/components/CreditExplanation/getCreditModal'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { useModal } from 'ui/components/modals/useModal'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'

interface Props {
  domainsCredit: DomainsCredit
  isUserUnderageBeneficiary: boolean
  depositExpirationDate?: string
}

export const CreditExplanation: FunctionComponent<Props> = (props) => {
  const { visible, showModal, hideModal } = useModal(false)
  const { buttonTitle, creditModal: CreditModal } = getCreditModal(props)

  if (!buttonTitle || !CreditModal) {
    return null
  }

  return (
    <React.Fragment>
      <StyledButtonTertiary
        icon={InfoPlain}
        wording={buttonTitle}
        onPress={showModal}
        testID="explanationButton"
      />
      <CreditModal visible={visible} hideModal={hideModal} domainsCredit={props.domainsCredit} />
    </React.Fragment>
  )
}

const StyledButtonTertiary = styledButton(ButtonTertiary)({
  justifyContent: 'flex-start',
})
