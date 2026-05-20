import { Scenario } from 'features/offerCtaPoc/fixtures/scenarios'
import { resolveOfferCta } from 'features/offerCtaPoc/helpers/resolveOfferCta'
import { useOfferCtaDataQuery } from 'features/offerCtaPoc/queries/useOfferCtaDataQuery'
import { CtaDecision } from 'features/offerCtaPoc/types'

// VARIANT B — single-responsibility use-case hook: "what is the CTA decision?".
export const useCtaDecision = (
  scenario: Scenario
): { isLoading: boolean; decision?: CtaDecision } => {
  const { data, isLoading } = useOfferCtaDataQuery(scenario)

  return { isLoading, decision: data ? resolveOfferCta(data) : undefined }
}
