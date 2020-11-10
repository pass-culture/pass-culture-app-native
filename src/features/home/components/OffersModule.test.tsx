import { render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'

import { mockedAlgoliaResponse } from '../../../libs/algolia/mockedResponses/mockedAlgoliaResponse'
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
const queryCache = new QueryCache()
describe('OffersModule component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', async () => {
    const OffersModuleComp = render(
      <ReactQueryCacheProvider queryCache={queryCache}>
        <OffersModule algolia={props.algolia} display={props.display} moduleId={props.moduleId} />
      </ReactQueryCacheProvider>
    )
    await waitFor(() => OffersModuleComp.getAllByText('MUSIQUE'))
    expect(OffersModuleComp).toMatchSnapshot()
  })
})
