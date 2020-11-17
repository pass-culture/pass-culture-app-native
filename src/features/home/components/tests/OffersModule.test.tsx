import { render, waitFor } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { AlgoliaParametersFields, DisplayParametersFields } from '../../contentful/contentful'
import { OffersModule } from '../OffersModule'

mockdate.set(new Date(2020, 10, 16))

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
        <OffersModule
          algolia={props.algolia}
          display={props.display}
          moduleId={props.moduleId}
          position={null}
        />
      )
    )
    await waitFor(() => OffersModuleComp.getAllByText('Musique'))
    expect(OffersModuleComp).toMatchSnapshot()
  })
})
