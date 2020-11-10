import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { AlgoliaParametersFields, DisplayParametersFields } from '../contentful/contentful'

import { OffersModule } from './OffersModule'

const props = {
  algolia: {} as AlgoliaParametersFields,
  display: { minOffers: 0 } as DisplayParametersFields,
  moduleId: 'module-id',
}
jest.mock('libs/algolia/fetchAlgolia', () => ({
  fetchAlgolia: () => mockedAlgoliaResponse,
}))

describe('OffersModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', async () => {
    const OffersModuleComp = render(
      reactQueryProviderHOC(
        <OffersModule algolia={props.algolia} display={props.display} moduleId={props.moduleId} />
      )
    )
    await waitFor(() => OffersModuleComp.getAllByText('MUSIQUE'))
    expect(OffersModuleComp).toMatchSnapshot()
  })
})
