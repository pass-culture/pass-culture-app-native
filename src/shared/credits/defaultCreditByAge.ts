import type { ReadonlyDeep } from 'type-fest'

import { DepositAmountsByAge } from 'api/gen'

type Version = 'v2' | 'v3'

export const defaultCreditByAge = {
  v2: {
    age_15: 20_00,
    age_16: 30_00,
    age_17: 30_00,
    age_18: 300_00,
  },
  v3: {
    age_15: 0,
    age_16: 0,
    age_17: 50_00,
    age_18: 150_00,
  },
} as const satisfies ReadonlyDeep<Record<Version, DepositAmountsByAge>>
