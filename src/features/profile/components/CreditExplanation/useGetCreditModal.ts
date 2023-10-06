import { DomainsCredit } from 'api/gen'
import { CreditCeilingsModal } from 'features/profile/components/Modals/CreditCeilingsModal'
import { ExhaustedCreditModal } from 'features/profile/components/Modals/ExhaustedCreditModal'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { useIsUserUnderageBeneficiary } from 'features/profile/helpers/useIsUserUnderageBeneficiary'
import { analytics } from 'libs/analytics'

interface Props {
  domainsCredit: DomainsCredit
  isDepositExpired: boolean
}

export const useGetCreditModal = ({ domainsCredit, isDepositExpired }: Props) => {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  const digitalCeiling = domainsCredit?.digital?.initial

  if (isDepositExpired) {
    return {
      buttonTitle: 'Mon crédit est expiré, que\u00a0faire\u00a0?',
      creditModal: ExpiredCreditModal,
      analytics: analytics.logConsultModalExpiredGrant,
    }
  }
  if (domainsCredit.all.remaining === 0) {
    return {
      buttonTitle: 'J’ai dépensé tout mon crédit, que\u00a0faire\u00a0?',
      creditModal: ExhaustedCreditModal,
      analytics: analytics.logConsultModalNoMoreCredit,
    }
  }
  if (!isUserUnderageBeneficiary && digitalCeiling != null) {
    return {
      buttonTitle: 'Pourquoi cette limite\u00a0?',
      creditModal: CreditCeilingsModal,
      analytics: analytics.logConsultModalBeneficiaryCeilings,
    }
  }

  return { buttonTitle: null, creditModal: null }
}
