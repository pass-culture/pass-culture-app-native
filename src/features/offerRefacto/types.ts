export type HasEnoughCreditType =
  | { hasEnoughCredit: true; message?: never }
  | { hasEnoughCredit: false; message?: string }
