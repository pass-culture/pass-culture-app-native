import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { OfferDuo } from './OfferDuo'

describe('OfferDuo component', () => {
  it('should render OfferDuo with Activé description', () => {
    const { queryByText } = renderOfferDuo()
    expect(queryByText(`Activé`)).toBeTruthy()
  })
})

function renderOfferDuo() {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<OfferDuo />))
}
