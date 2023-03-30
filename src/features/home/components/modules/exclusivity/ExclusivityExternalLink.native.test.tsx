import React from 'react'
import { Linking } from 'react-native'

import { ExclusivityExternalLink } from 'features/home/components/modules/exclusivity/ExclusivityExternalLink'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { linking } from 'features/navigation/RootNavigator/linking'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/navigationRef')

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

  it('should open external url when clicking on the component and url is not in-app url', async () => {
    render(<ExclusivityExternalLink {...props} />)

    fireEvent.press(screen.getByTestId('Image d’Adèle'))

    expect(Linking.openURL).toHaveBeenCalledWith(props.url)
  })

  it.each(linking.prefixes)(
    'should open internal url when clicking on the component and url is prefixed with %s',
    (urlPrefix) => {
      const internalUrl = `${urlPrefix}profil`
      render(<ExclusivityExternalLink {...props} url={internalUrl} />)

      fireEvent.press(screen.getByTestId('Image d’Adèle'))

      expect(navigateFromRef).toHaveBeenCalledWith('TabNavigator', {
        screen: 'Profile',
      })
    }
  )
})
