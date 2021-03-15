import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Linking } from 'react-native'
import { UseQueryResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import * as HomeAPI from 'features/home/api'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { BusinessPane } from '../../contentful'
import { BusinessModule } from '../BusinessModule'
jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showInfoSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowInfoSnackBar(props)),
  }),
}))

const props: BusinessPane = {
  title: 'Title of module',
  firstLine: 'firstLine',
  secondLine: 'secondLine',
  image: 'https://fr.web.img6.acsta.net/medias/nmedia/18/96/46/01/20468669.jpg',
  url: 'url',
  moduleId: 'module-id',
  targetNotConnectedUsersOnly: undefined,
  leftIcon: undefined,
}

describe('BusinessModule component', () => {
  const openUrlSpy = jest.spyOn(Linking, 'openURL')
  const homeAPISpy = jest.spyOn(HomeAPI, 'useUserProfileInfo')
  beforeEach(() => jest.clearAllMocks())

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

  it('should log "BusinessBlockClicked" when clicking on the image', () => {
    const { getByTestId } = renderModule(props)
    fireEvent.press(getByTestId('imageBusiness'))
    expect(analytics.logClickBusinessBlock).toHaveBeenCalledWith(props.title)
  })

  it('should open url when clicking on the image', async () => {
    const { getByTestId } = renderModule(props)
    fireEvent.press(getByTestId('imageBusiness'))

    await waitForExpect(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('url')
    })
  })

  it('should open url with replaced Email when connected and adequate url and display snackbar waiting for email', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn: true }))
    const { getByTestId } = renderModule({ ...props, url: 'some_url_with_email={email}' })

    fireEvent.press(getByTestId('imageBusiness'))
    await superFlushWithAct(30)

    await waitForExpect(() => {
      expect(mockShowInfoSnackBar).toHaveBeenCalledWith({
        message: 'Redirection en cours',
      })
      expect(openUrlSpy).toHaveBeenCalledWith('some_url_with_email=email@domain.ext')
    })
  })

  it('should redirect with filled email when required without the snackbar being displayed when email is already okay', async () => {
    homeAPISpy.mockImplementation(() => {
      return {
        isLoading: false,
        data: { email: 'email2@domain.ext', firstName: 'Jean' },
      } as UseQueryResult<UserProfileResponse>
    })

    const { getByTestId } = renderModule({ ...props, url: 'some_url_with_email={email}' })

    fireEvent.press(getByTestId('imageBusiness'))
    await waitForExpect(() =>
      expect(openUrlSpy).toHaveBeenCalledWith('some_url_with_email=email2@domain.ext')
    )
    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
    homeAPISpy.mockReset()
  })

  it('should not display a snackbar when user profile data is yet to be received but the email is not needed', async () => {
    homeAPISpy.mockImplementation(() => {
      return {
        isLoading: true,
        data: undefined,
      } as UseQueryResult<UserProfileResponse>
    })

    const { getByTestId } = renderModule({ ...props, url: 'some_url_with_no_email' })

    fireEvent.press(getByTestId('imageBusiness'))
    await waitForExpect(() => expect(openUrlSpy).toHaveBeenCalledWith('some_url_with_no_email'))
    expect(mockShowInfoSnackBar).not.toHaveBeenCalled()
    homeAPISpy.mockReset()
  })
})

const renderModule = (props: BusinessPane) =>
  render(reactQueryProviderHOC(<BusinessModule {...props} />))
