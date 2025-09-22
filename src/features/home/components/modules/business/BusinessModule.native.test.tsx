import React from 'react'
import { Linking } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { BusinessModule } from 'features/home/components/modules/business/BusinessModule'
import { BusinessModuleProps } from 'features/home/components/modules/business/types'
import { beneficiaryUser } from 'fixtures/user'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT_LONG } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

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

  it('should open url with replaced Email when connected and adequate url and display snackbar waiting for email', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockImplementation(() => ({
      isLoggedIn: true,
      isUserLoading: true,
    }))

    renderModule({
      ...props,
      url: 'some_url_with_email={email}',
    })

    await user.press(screen.getByTestId('imageBusiness'))

    await waitFor(() => {
      expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
        message: 'Redirection en cours',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
    })
  })

  it('should redirect with filled email when required without the snackbar being displayed when email is already okay', async () => {
    // We don't use mockReturnValueOnce because useAuthContext is called twice : for the first BusinessModule render and when the link is pressed (shouldRedirect goes from false to true)
    mockAuthContextWithUser(
      { ...beneficiaryUser, email: 'email2@domain.ext', firstName: 'Jean' },
      { persist: true }
    )

    renderModule({
      ...props,
      url: 'some_url_with_email={email}',
    })

    await user.press(screen.getByTestId('imageBusiness'))
    await waitFor(() =>
      expect(openURLSpy).toHaveBeenCalledWith('some_url_with_email=email2@domain.ext')
    )

    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()

    mockUseAuthContext.mockReset()
  })

  it('should not display a snackbar when user profile data is yet to be received but the email is not needed', async () => {
    // We don't use mockReturnValueOnce because useAuthContext is called twice : for the first BusinessModule render and when the link is pressed (shouldRedirect goes from false to true)
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      user: undefined,
      isUserLoading: true,
      isLoggedIn: false,
    })

    renderModule({
      ...props,
      url: 'some_url_with_no_email',
    })

    await user.press(screen.getByTestId('imageBusiness'))
    await waitFor(() => expect(openURLSpy).toHaveBeenCalledWith('some_url_with_no_email'))

    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()

    mockUseAuthContext.mockReset()
  })
})

const renderModule = (props: BusinessModuleProps, isDesktopViewport?: boolean) =>
  render(reactQueryProviderHOC(<BusinessModule {...props} />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
