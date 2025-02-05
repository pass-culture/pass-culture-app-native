import React from 'react'

import { mockSettings } from 'features/auth/context/mockSettings'
import { ExclusivityBanner } from 'features/home/components/modules/exclusivity/ExclusivityBanner'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { render } from 'tests/utils'

const props = {
  title: 'Image d’Adèle',
  alt: 'Image d’Adèle',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  moduleId: 'module-id',
  display: { isGeolocated: false, aroundRadius: undefined, title: '' },
  homeEntryId: 'abcd',
  index: 1,
}

mockSettings()

describe('ExclusivityBanner component', () => {
  it('should trigger logEvent "ModuleDisplayedOnHomepage" on render', () => {
    render(<ExclusivityBanner {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: props.moduleId,
      moduleType: ContentTypes.EXCLUSIVITY,
      index: props.index,
      homeEntryId: props.homeEntryId,
    })
  })
})
