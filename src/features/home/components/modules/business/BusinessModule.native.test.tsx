import React from 'react'
import { Linking } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { analytics } from 'libs/analytics'
import { ContentTypes } from 'libs/contentful/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, waitFor, screen } from 'tests/utils'
import { SNACK_BAR_TIME_OUT_LONG } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BusinessModule, BusinessModuleProps } from './BusinessModule'

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
  url: 'url',
  moduleId: 'module-id',
  shouldTargetNotConnectedUsers: undefined,
  leftIcon: undefined,
  homeEntryId: 'abcd',
  index: 1,
  localizationArea: undefined,
}

describe('BusinessModule component', () => {
  const openURLSpy = jest.spyOn(Linking, 'openURL')

  it('should render correctly - with leftIcon = Idea by default', () => {
    const { toJSON } = renderModule(props)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render correctly - with leftIcon provided', () => {
    const { toJSON } = renderModule({
      ...props,
      leftIcon:
        'https://images.ctfassets.net/2bg01iqy0isv/1Sh2Ter3f4GgW9m926jqB5/83adbbd38e399d0089ff7b8f0efadf4c/Europe.png',
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should disable click when no URL', () => {
    const { toJSON } = renderModule({
      ...props,
      url: undefined,
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should log "BusinessBlockClicked" when clicking on the image', () => {
    renderModule(props)
    fireEvent.press(screen.getByTestId('imageBusiness'))
    expect(analytics.logBusinessBlockClicked).toHaveBeenCalledWith({
      moduleName: props.analyticsTitle,
      moduleId: props.moduleId,
      homeEntryId: props.homeEntryId,
    })
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
    renderModule(props)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      props.moduleId,
      ContentTypes.BUSINESS,
      props.index,
      props.homeEntryId
    )
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
    mockUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: true }))
    renderModule({ ...props, shouldTargetNotConnectedUsers: true })

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should open url when clicking on the image', async () => {
    renderModule(props)
    fireEvent.press(screen.getByTestId('imageBusiness'))

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

    fireEvent.press(screen.getByTestId('imageBusiness'))

    await waitFor(() => {
      expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
        message: 'Redirection en cours',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
    })
  })

  it('should redirect with filled email when required without the snackbar being displayed when email is already okay', async () => {
    // We don't use mockReturnValueOnce because useAuthContext is called twice : for the first BusinessModule render and when the link is pressed (shouldRedirect goes from false to true)
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      user: { email: 'email2@domain.ext', firstName: 'Jean' },
      isUserLoading: false,
      isLoggedIn: true,
    })

    renderModule({
      ...props,
      url: 'some_url_with_email={email}',
    })

    fireEvent.press(screen.getByTestId('imageBusiness'))
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

    fireEvent.press(screen.getByTestId('imageBusiness'))
    await waitFor(() => expect(openURLSpy).toHaveBeenCalledWith('some_url_with_no_email'))
    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
    mockUseAuthContext.mockReset()
  })
})

const renderModule = (props: BusinessModuleProps) =>
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  render(reactQueryProviderHOC(<BusinessModule {...props} />))
