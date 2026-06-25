import { CtaDecision, CtaType } from 'features/offerCtaPoc/types'

// Exhaustiveness guard: if a new CtaType is added without a case here, this
// fails to COMPILE (the argument is no longer `never`). This is the vanilla-TS
// equivalent of ts-pattern's `.exhaustive()` — see POC-FINDINGS.md for the
// side-by-side comparison.
const assertNever = (value: never): never => {
  throw new Error(`Unhandled CtaType: ${JSON.stringify(value)}`)
}

// Pure mapping `CtaType -> render-ready content`. No React, no I/O, no i18n lib.
export const ctaContent = (type: CtaType): CtaDecision => {
  switch (type) {
    case 'AUTHENTICATION':
      return { type, wording: 'Réserver', isDisabled: false }
    case 'BOOK_OFFER':
      return { type, wording: 'Réserver', isDisabled: false }
    case 'INSUFFICIENT_CREDIT':
      return { type, wording: 'Crédit insuffisant', isDisabled: true }
    case 'SOLD_OUT_OFFER':
      return { type, wording: 'Offre épuisée', isDisabled: true }
    case 'SEE_BOOKING':
      return { type, wording: 'Voir ma réservation', isDisabled: false }
    default:
      return assertNever(type)
  }
}
