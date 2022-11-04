import React from 'react'

import { ExclusivityBanner } from 'features/home/components/modules/exclusivity/ExclusivityBanner'
import { ContentTypes } from 'features/home/contentful'
import { analytics } from 'libs/firebase/analytics'
import { render } from 'tests/utils'

jest.mock('features/auth/settings')

const props = {
  title: "Image d'Adèle",
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  moduleId: 'module-id',
  display: { isGeolocated: false, aroundRadius: undefined, title: '' },
  homeEntryId: 'abcd',
  index: 1,
}

describe('ExclusivityBanner component', () => {
  it('should trigger logEvent "ModuleDisplayedOnHomepage" on render', () => {
    render(<ExclusivityBanner {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      props.moduleId,
      ContentTypes.EXCLUSIVITY,
      props.index,
      props.homeEntryId
    )
  })
})
