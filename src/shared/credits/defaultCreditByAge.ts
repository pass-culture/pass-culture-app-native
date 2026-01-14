import type { ReadonlyDeep } from 'type-fest'

import { DepositAmountsByAge } from 'api/gen'

export const defaultCreditByAge = {
  age_15: 0,
  age_16: 0,
  age_17: 50_00,
  age_18: 150_00,
} as const satisfies ReadonlyDeep<DepositAmountsByAge>

export const bonificationAmountFallbackValue = 50_00
