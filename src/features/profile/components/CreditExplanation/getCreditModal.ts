import { DomainsCredit } from 'api/gen'
import { CreditCeilingsModal } from 'features/profile/components/Modals/CreditCeilingsModal'
import { ExhaustedCreditModal } from 'features/profile/components/Modals/ExhaustedCreditModal'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'

interface Props {
  domainsCredit: DomainsCredit
  isUserUnderageBeneficiary: boolean
  isDepositExpired: boolean
}

export const getCreditModal = ({
  domainsCredit,
  isUserUnderageBeneficiary,
  isDepositExpired,
}: Props) => {
  if (isDepositExpired) {
    return {
      buttonTitle: 'Mon crédit est expiré, que\u00a0faire\u00a0?',
      creditModal: ExpiredCreditModal,
    }
  }
  if (domainsCredit.all.remaining === 0) {
    return {
      buttonTitle: 'J’ai dépensé tout mon crédit, que\u00a0faire\u00a0?',
      creditModal: ExhaustedCreditModal,
    }
  }
  if (!isUserUnderageBeneficiary) {
    return { buttonTitle: 'Pourquoi cette limite\u00a0?', creditModal: CreditCeilingsModal }
  }

  return { buttonTitle: null, creditModal: null }
}
