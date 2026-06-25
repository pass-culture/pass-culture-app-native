import React from 'react'

import { OfferCtasView } from 'features/offerCtaPoc/components/variantA/OfferCtasView'
import { Scenario } from 'features/offerCtaPoc/fixtures/scenarios'
import { useOfferCtaViewModelComposed } from 'features/offerCtaPoc/hooks/useOfferCtaViewModelComposed'

// VARIANT C container: composed ViewModel hook + REUSE of variant A's pure View.
// Demonstrates that the View is genuinely orchestration-agnostic.

type Props = {
  scenario: Scenario
}

export const OfferCtas: React.FC<Props> = ({ scenario }) => {
  const viewModel = useOfferCtaViewModelComposed(scenario)

  return <OfferCtasView viewModel={viewModel} />
}
