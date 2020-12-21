import { StackScreenProps } from '@react-navigation/stack'
import { render } from '@testing-library/react-native'
import React from 'react'

import { IdCheck } from 'features/cheatcodes/pages/IdCheck'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'

const navigationProps = {
  route: {
    params: {
      email: 'john@wick.com',
      licenceToken: 'XxLicenceTokenxX',
    },
  },
} as StackScreenProps<RootStackParamList, 'IdCheck'>

jest.mock('ui/components/LoadingPage', () => ({
  LoadingPage: () => 'LoadingPageMock',
}))

describe('<IdCheck />', () => {
  it('should render correctly', () => {
    const instance = render(<IdCheck {...navigationProps} />)
    expect(instance).toMatchSnapshot()
  })

  it('should display web page with correct url', () => {
    const { getByTestId } = render(<IdCheck {...navigationProps} />)
    const webview = getByTestId('idcheck-webview')
    expect(webview.props.source.uri).toEqual(
      env.ID_CHECK_URL + '/?email=john@wick.com&licence_token=XxLicenceTokenxX'
    )
  })
})
