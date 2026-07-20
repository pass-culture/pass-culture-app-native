import { resolveOfferCta, resolveOfferCtaType } from 'features/offerCtaPoc/helpers/resolveOfferCta'
import { CtaType, ResolveOfferCtaInput } from 'features/offerCtaPoc/types'

// NOTE: ZERO mocks, ZERO React. The whole point of the pure core: the decision
// is validated by an input/output table. This is the "socle" kill-criterion.

const baseInput: ResolveOfferCtaInput = {
  offer: { id: 1, name: 'Test offer', priceInCents: 1000, isSoldOut: false },
  user: { isLoggedIn: true, hasEnoughCredit: true },
}

const build = (overrides: {
  offer?: Partial<ResolveOfferCtaInput['offer']>
  user?: Partial<ResolveOfferCtaInput['user']>
}): ResolveOfferCtaInput => ({
  offer: { ...baseInput.offer, ...overrides.offer },
  user: { ...baseInput.user, ...overrides.user },
})

describe('resolveOfferCtaType', () => {
  const cases: { name: string; input: ResolveOfferCtaInput; expected: CtaType }[] = [
    {
      name: 'not logged in -> AUTHENTICATION (wins over everything)',
      input: build({ user: { isLoggedIn: false, hasEnoughCredit: false } }),
      expected: 'AUTHENTICATION',
    },
    {
      name: 'already booked -> SEE_BOOKING (before sold out / credit)',
      input: build({
        user: { isLoggedIn: true, hasEnoughCredit: false, alreadyBookedOfferId: 42 },
        offer: { isSoldOut: true },
      }),
      expected: 'SEE_BOOKING',
    },
    {
      name: 'sold out -> SOLD_OUT_OFFER (before credit)',
      input: build({ offer: { isSoldOut: true }, user: { hasEnoughCredit: false } }),
      expected: 'SOLD_OUT_OFFER',
    },
    {
      name: 'not enough credit -> INSUFFICIENT_CREDIT',
      input: build({ user: { hasEnoughCredit: false } }),
      expected: 'INSUFFICIENT_CREDIT',
    },
    {
      name: 'nominal beneficiary -> BOOK_OFFER',
      input: build({}),
      expected: 'BOOK_OFFER',
    },
  ]

  it.each(cases)('$name', ({ input, expected }) => {
    expect(resolveOfferCtaType(input)).toBe(expected)
  })
})

describe('resolveOfferCta', () => {
  it('maps the decision to render-ready content', () => {
    expect(resolveOfferCta(build({ user: { hasEnoughCredit: false } }))).toEqual({
      type: 'INSUFFICIENT_CREDIT',
      wording: 'Crédit insuffisant',
      isDisabled: true,
    })
  })

  it('returns an enabled "Réserver" CTA for a bookable offer', () => {
    expect(resolveOfferCta(build({}))).toEqual({
      type: 'BOOK_OFFER',
      wording: 'Réserver',
      isDisabled: false,
    })
  })
})
