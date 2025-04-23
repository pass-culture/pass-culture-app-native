import React from 'react'

import { BusinessModule } from 'features/home/components/modules/business/BusinessModule'
import { BusinessModuleProps } from 'features/home/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

const props: BusinessModuleProps = {
  analyticsTitle: 'Title of module',
  title: 'firstLine',
  subtitle: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  imageWeb:
    'https://images.ctfassets.net/2bg01iqy0isv/1jedJLjdDiypJqBtO1sjH0/185ee9e6428229a15d4c047b862a95f8/image_web.jpeg',
  url: 'url',
  moduleId: 'module-id',
  shouldTargetNotConnectedUsers: undefined,
  homeEntryId: 'abcd',
  index: 1,
  localizationArea: undefined,
  callToAction: 'En savoir plus',
  date: undefined,
}

jest.mock('libs/firebase/analytics/analytics')

describe('BusinessModule component', () => {
  it('should render NewBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is on', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_APP_V2_BUSINESS_BLOCK])
    renderBusinessModule(props)

    expect(screen.getByText('En savoir plus')).toBeOnTheScreen()
  })

  it('should render OldBusinessModule if FF WIP_APP_V2_BUSINESS_BLOCK is off', async () => {
    setFeatureFlags()
    renderBusinessModule(props)

    expect(screen.queryByText('En savoir plus')).not.toBeOnTheScreen()
  })
})

const renderBusinessModule = (props: BusinessModuleProps) =>
  render(reactQueryProviderHOC(<BusinessModule {...props} />))
