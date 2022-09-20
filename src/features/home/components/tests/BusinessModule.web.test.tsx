import React from 'react'
import { Linking } from 'react-native'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { BusinessModule } from 'features/home/components'
import { BusinessModuleProps } from 'features/home/components/BusinessModule'
import * as profileAPI from 'features/profile/api'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct, render, fireEvent } from 'tests/utils/web'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')
jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

const props: BusinessModuleProps = {
  title: 'Title of module',
  firstLine: 'firstLine',
  secondLine: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  url: 'url',
  moduleId: 'module-id',
  targetNotConnectedUsersOnly: undefined,
  leftIcon: undefined,
  homeEntryId: 'abcd',
  index: 1,
}

describe('BusinessModule component', () => {
  const openURLSpy = jest.spyOn(Linking, 'openURL')
  const homeAPISpy = jest.spyOn(profileAPI, 'useUserProfileInfo')

  it('should render correctly - with leftIcon = Idea by default', () => {
    const renderAPI = renderModule(props)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly - with leftIcon provided', () => {
    const renderAPI = renderModule({
      ...props,
      leftIcon:
        'https://images.ctfassets.net/2bg01iqy0isv/1Sh2Ter3f4GgW9m926jqB5/83adbbd38e399d0089ff7b8f0efadf4c/Europe.png',
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should disable click when no URL', () => {
    const renderAPI = renderModule({
      ...props,
      url: undefined,
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should log "BusinessBlockClicked" when clicking on the image', () => {
    const { getByTestId } = renderModule(props)
    fireEvent.click(getByTestId('imageBusiness'))
    expect(analytics.logBusinessBlockClicked).toHaveBeenCalledWith({
      moduleName: props.title,
      moduleId: props.moduleId,
    })
  })

  it('should open url when clicking on the image', async () => {
    const { getByTestId } = renderModule(props)
    fireEvent.click(getByTestId('imageBusiness'))

    await waitForExpect(() => {
      expect(openURLSpy).toHaveBeenCalledWith('url')
    })
  })

  it('should open url with replaced Email when connected and adequate url and display snackbar waiting for email', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: true }))
    const { getByTestId } = renderModule({ ...props, url: 'some_url_with_email={email}' })

    fireEvent.click(getByTestId('imageBusiness'))
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
        message: 'Redirection en cours',
      })
      expect(openURLSpy).toHaveBeenCalledWith('some_url_with_email=email@domain.ext')
    })
  })

  it('should redirect with filled email when required without the snackbar being displayed when email is already okay', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    homeAPISpy.mockImplementation(() => {
      return {
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean' },
      } as UseQueryResult<UserProfileResponse>
    })

    const { getByTestId } = renderModule({ ...props, url: 'some_url_with_email={email}' })

    fireEvent.click(getByTestId('imageBusiness'))
    await waitForExpect(() =>
      expect(openURLSpy).toHaveBeenCalledWith('some_url_with_email=email2@domain.ext')
    )
    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
    homeAPISpy.mockReset()
  })

  it('should not display a snackbar when user profile data is yet to be received but the email is not needed', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
    homeAPISpy.mockImplementation(() => {
      return {
        isLoading: true,
        data: undefined,
      } as UseQueryResult<UserProfileResponse>
    })

    const { getByTestId } = renderModule({ ...props, url: 'some_url_with_no_email' })

    fireEvent.click(getByTestId('imageBusiness'))
    await waitForExpect(() => expect(openURLSpy).toHaveBeenCalledWith('some_url_with_no_email'))
    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
    homeAPISpy.mockReset()
  })
})

const renderModule = (props: BusinessModuleProps) =>
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  render(reactQueryProviderHOC(<BusinessModule {...props} />))
