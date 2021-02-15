import { Expense, ExpenseDomain } from 'api/gen/api'
import { OfferDigital } from 'ui/svg/icons/OfferDigital'
import { OfferOutings } from 'ui/svg/icons/OfferOutings'
import { OfferOutingsPhysical } from 'ui/svg/icons/OfferOutingsPhysical'
import { OfferPhysical } from 'ui/svg/icons/OfferPhysical'
import { ColorsEnum } from 'ui/theme'

export const CreditCeilingMapV1 = {
  [ExpenseDomain.All]: {
    label: 'en sorties (concerts...)',
    color: ColorsEnum.ACCENT,
    icon: OfferOutings,
  },
  [ExpenseDomain.Physical]: {
    label: 'en offres physiques (livres...)',
    color: ColorsEnum.SECONDARY,
    icon: OfferPhysical,
  },
  [ExpenseDomain.Digital]: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.PRIMARY,
    icon: OfferDigital,
  },
}

export const CreditCeilingMapV2 = {
  [ExpenseDomain.All]: {
    label: 'en sorties & biens physiques (concerts, livres...)',
    color: ColorsEnum.PRIMARY,
    icon: OfferOutingsPhysical,
  },
  [ExpenseDomain.Digital]: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.SECONDARY,
    icon: OfferDigital,
  },
}

export type ExpenseTypeAndVersion =
  | {
      type: keyof typeof CreditCeilingMapV1
      depositVersion: 1
    }
  | {
      type: keyof typeof CreditCeilingMapV2
      depositVersion: 2
    }

export type ExpenseV2 = Omit<Expense, 'domain'> & {
  domain: ExpenseDomain.All | ExpenseDomain.Digital
}

export const ExpenseDomainOrderV1 = {
  [ExpenseDomain.Digital]: 1,
  [ExpenseDomain.Physical]: 2,
  [ExpenseDomain.All]: 3,
}

export const ExpenseDomainOrderV2 = {
  [ExpenseDomain.Digital]: 1,
  [ExpenseDomain.All]: 2,
}

export type ExpensesAndDepositVersion =
  | {
      expenses: Expense[]
      depositVersion: 1
    }
  | {
      expenses: ExpenseV2[]
      depositVersion: 2
    }
