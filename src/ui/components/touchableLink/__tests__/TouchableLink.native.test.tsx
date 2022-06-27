import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { render, fireEvent } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { TouchableLink } from '../TouchableLink'

const testID = 'touchableLink'
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('features/navigation/navigationRef')

describe('<TouchableLink />', () => {
  it('should not navigate if no screen or url is given', () => {
    const { getByTestId } = render(<TouchableLink testID={testID} />)
    fireEvent.press(getByTestId(testID))
    expect(navigate).not.toBeCalled()
    expect(openUrl).not.toBeCalled()
  })

  it('should navigate to right screen with expected params', async () => {
    const { getByTestId } = render(
      <TouchableLink
        navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1] }}
        testID={testID}
      />
    )
    fireEvent.press(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(...homeNavConfig)
    })
  })

  it('should not navigate to right screen with expected params when enableNavigate is false', async () => {
    const { getByTestId } = render(
      <TouchableLink
        enableNavigate={false}
        navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1] }}
        testID={testID}
      />
    )
    fireEvent.press(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigate).not.toBeCalledWith(...homeNavConfig)
    })
  })

  it('should navigate using navigateFromRef if fromRef={true}', async () => {
    const { getByTestId } = render(
      <TouchableLink
        navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1], fromRef: true }}
        testID={testID}
      />
    )
    fireEvent.press(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(...homeNavConfig)
    })
  })

  it('should open url if external link is given', async () => {
    const url = 'https://example.com'
    const { getByTestId } = render(<TouchableLink externalNav={{ url }} testID={testID} />)
    fireEvent.press(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(openUrl).toBeCalledWith(url, undefined)
    })
  })

  it('should render with correct style if component tag is given', async () => {
    const url = 'https://example.com'
    const buttonText = 'button'
    const { getByTestId: getButtonByTestID } = render(<ButtonPrimary wording={buttonText} />)
    const { getByTestId, getByText } = render(
      <TouchableLink
        as={ButtonPrimary}
        wording={buttonText}
        externalNav={{ url }}
        testID={testID}
      />
    )
    const expectedStyle = getButtonByTestID(buttonText).props.style
    const link = getByTestId(testID)

    expect(getByText(buttonText)).toBeTruthy()
    expect(link.props.style).toEqual(expectedStyle)

    fireEvent.press(link)
    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(openUrl).toBeCalledWith(url, undefined)
    })
  })
})
