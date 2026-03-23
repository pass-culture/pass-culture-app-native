import React from 'react'
import { Linking } from 'react-native'

import { BusinessModule } from 'features/home/components/modules/business/BusinessModule'
import { BusinessModuleProps } from 'features/home/components/modules/business/types'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

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
  date: 'Du 3 juillet au 4 novembre',
}

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('BusinessModule component', () => {
  const openURLSpy = jest.spyOn(Linking, 'openURL')

  it('should log "BusinessBlockClicked" when clicking on the image', async () => {
    renderModule(props)
    await user.press(screen.getByTestId('imageBusiness'))

    expect(analytics.logBusinessBlockClicked).toHaveBeenCalledWith({
      moduleName: props.analyticsTitle,
      moduleId: props.moduleId,
      homeEntryId: props.homeEntryId,
    })
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
    renderModule(props)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(1, {
      moduleId: props.moduleId,
      moduleType: ContentTypes.BUSINESS,
      index: props.index,
      homeEntryId: props.homeEntryId,
    })
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
    renderModule({ ...props, shouldTargetNotConnectedUsers: true })

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should open url when clicking on the image', async () => {
    renderModule(props)
    await user.press(screen.getByTestId('imageBusiness'))

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith('url')
    })
  })
})

const renderModule = (props: BusinessModuleProps, isDesktopViewport?: boolean) =>
  render(reactQueryProviderHOC(<BusinessModule {...props} />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
