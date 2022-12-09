import React from 'react'

import { ExclusivityExternalLink } from 'features/home/components/modules/exclusivity/ExclusivityExternalLink'
import { ContentTypes } from 'libs/contentful'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/auth/settings')

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const props = {
  title: "Image d'Adèle",
  alt: "Image d'Adèle",
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  moduleId: 'module-id',
  display: { isGeolocated: false, aroundRadius: undefined, title: '' },
  homeEntryId: 'abcd',
  index: 1,
  url: 'http://toto.com',
}

describe('ExclusivityExternalLink component', () => {
  it('should trigger logEvent "ModuleDisplayedOnHomepage" on render', () => {
    render(<ExclusivityExternalLink {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      props.moduleId,
      ContentTypes.EXCLUSIVITY,
      props.index,
      props.homeEntryId
    )
  })

  it('should open url when clicking on the component', () => {
    const { getByTestId } = render(<ExclusivityExternalLink {...props} />)

    fireEvent.press(getByTestId('exclusivity-external-link'))

    expect(openUrl).toHaveBeenCalledWith(props.url, undefined)
  })
})
