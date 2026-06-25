import React from 'react'

import { OfferCtasView } from 'features/offerCtaPoc/components/variantA/OfferCtasView'
import { Scenario } from 'features/offerCtaPoc/fixtures/scenarios'
import { useOfferCtaViewModel } from 'features/offerCtaPoc/hooks/useOfferCtaViewModel'

// VARIANT A container: builds the ViewModel, hands it to the pure View.

type Props = {
  scenario: Scenario
}

export const OfferCtas: React.FC<Props> = ({ scenario }) => {
  const viewModel = useOfferCtaViewModel(scenario)

  return <OfferCtasView viewModel={viewModel} />
}
