import React from 'react'

import { ExclusivityExternalLink } from 'features/home/components/modules/exclusivity/ExclusivityExternalLink'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { fireEvent, render, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const props = {
  title: 'Image d’Adèle',
  alt: 'Image d’Adèle',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  moduleId: 'module-id',
  display: { isGeolocated: false, aroundRadius: undefined, title: '' },
  homeEntryId: 'abcd',
  index: 1,
  url: 'http://toto.com',
}

jest.mock('libs/firebase/analytics/analytics')

describe('ExclusivityExternalLink component', () => {
  it('should trigger logEvent "ModuleDisplayedOnHomepage" on render', () => {
    render(<ExclusivityExternalLink {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: props.moduleId,
      moduleType: ContentTypes.EXCLUSIVITY,
      index: props.index,
      homeEntryId: props.homeEntryId,
    })
  })

  it('should open url when clicking on the component', () => {
    render(<ExclusivityExternalLink {...props} />)

    fireEvent.press(screen.getByTestId('Image d’Adèle'))

    expect(openUrl).toHaveBeenCalledWith(props.url, undefined, false)
  })
})
