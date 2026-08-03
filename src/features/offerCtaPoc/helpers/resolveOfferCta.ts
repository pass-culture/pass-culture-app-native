import { ctaContent } from 'features/offerCtaPoc/helpers/ctaContent'
import { CtaDecision, CtaType, ResolveOfferCtaInput } from 'features/offerCtaPoc/types'

// Each rule is a small PURE function returning a CtaType or `undefined`
// ("not my case"). The decision is their ordered composition via `??`.
// This mirrors the style of `offerRefacto/helpers/offerCTASelection.ts`,
// but on local POC types so it is testable in complete isolation.

type Rule = (input: ResolveOfferCtaInput) => CtaType | undefined

const requireAuthentication: Rule = ({ user }) => (user.isLoggedIn ? undefined : 'AUTHENTICATION')

const alreadyBooked: Rule = ({ user }) =>
  user.alreadyBookedOfferId === undefined ? undefined : 'SEE_BOOKING'

const soldOut: Rule = ({ offer }) => (offer.isSoldOut ? 'SOLD_OUT_OFFER' : undefined)

const insufficientCredit: Rule = ({ user }) =>
  user.hasEnoughCredit ? undefined : 'INSUFFICIENT_CREDIT'

// Order matters and encodes the business priority of the rules.
const RULES: Rule[] = [requireAuthentication, alreadyBooked, soldOut, insufficientCredit]

export const resolveOfferCtaType = (input: ResolveOfferCtaInput): CtaType => {
  for (const rule of RULES) {
    const type = rule(input)
    if (type) return type
  }
  return 'BOOK_OFFER'
}

export const resolveOfferCta = (input: ResolveOfferCtaInput): CtaDecision =>
  ctaContent(resolveOfferCtaType(input))
