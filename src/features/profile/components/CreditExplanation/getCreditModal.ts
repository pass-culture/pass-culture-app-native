import { t } from '@lingui/macro'

import { DomainsCredit } from 'api/gen'
import { CreditCeilingsModal } from 'features/profile/components/headers/Modals/CreditCeilingsModal'
import { ExhaustedCreditModal } from 'features/profile/components/headers/Modals/ExhaustedCreditModal'
import { ExpiredCreditModal } from 'features/profile/components/headers/Modals/ExpiredCreditModal'

interface Props {
  domainsCredit: DomainsCredit
  isUserUnderageBeneficiary: boolean
  depositExpirationDate?: string
}

export const getCreditModal = ({
  domainsCredit,
  isUserUnderageBeneficiary,
  depositExpirationDate,
}: Props) => {
  const expirationDate = depositExpirationDate ? new Date(depositExpirationDate) : undefined
  const isDepositExpired = expirationDate ? expirationDate < new Date() : false

  if (isDepositExpired) {
    return {
      buttonTitle: t`Mon crédit est expiré, que faire\u00a0?`,
      creditModal: ExpiredCreditModal,
    }
  }
  if (domainsCredit.all.remaining === 0) {
    return {
      buttonTitle: t`J’ai dépensé tout mon crédit, que faire\u00a0?`,
      creditModal: ExhaustedCreditModal,
    }
  }
  if (!isUserUnderageBeneficiary) {
    return { buttonTitle: t`Pourquoi cette limite\u00a0?`, creditModal: CreditCeilingsModal }
  }

  return { buttonTitle: null, creditModal: null }
}
