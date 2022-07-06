import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, push } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { navigateFromRef, pushFromRef } from 'features/navigation/navigationRef'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { render, fireEvent } from 'tests/utils/web'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { TouchableLink } from '../TouchableLink'

const testID = 'touchableLink'
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')
jest.mock('features/navigation/navigationRef')

describe('<TouchableLink />', () => {
  it('should not navigate if no screen or url is given', () => {
    const { getByTestId } = render(<TouchableLink testID={testID} />)
    fireEvent.click(getByTestId(testID))
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
    fireEvent.click(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(...homeNavConfig)
    })
  })

  it('should push to right screen with expected params', async () => {
    const { getByTestId } = render(
      <TouchableLink
        navigateTo={{ screen: homeNavConfig[0], params: homeNavConfig[1], withPush: true }}
        testID={testID}
      />
    )
    fireEvent.click(getByTestId(testID))
    await waitForExpect(() => {
      expect(push).toBeCalledWith(...homeNavConfig)
    })
  })

  it('should navigate using navigateFromRef if fromRef={true}', async () => {
    const { getByTestId } = render(
      <TouchableLink
        navigateTo={{
          screen: homeNavConfig[0],
          params: homeNavConfig[1],
          fromRef: true,
        }}
        testID={testID}
      />
    )
    fireEvent.click(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigateFromRef).toBeCalledWith(...homeNavConfig)
    })
  })

  it('should navigate using pushFromRef if fromRef={true}', async () => {
    const { getByTestId } = render(
      <TouchableLink
        navigateTo={{
          screen: homeNavConfig[0],
          params: homeNavConfig[1],
          fromRef: true,
          withPush: true,
        }}
        testID={testID}
      />
    )
    fireEvent.click(getByTestId(testID))
    await waitForExpect(() => {
      expect(pushFromRef).toBeCalledWith(...homeNavConfig)
    })
  })

  it('should open url if external link is given', async () => {
    const url = 'https://example.com'
    const { getByTestId } = render(<TouchableLink externalNav={{ url }} testID={testID} />)
    fireEvent.click(getByTestId(testID))
    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(openUrl).toBeCalledWith(url, undefined)
    })
  })

  it('should render an anchor with href if a navigation prop is given', async () => {
    const url = 'https://example.com'
    const { getByTestId } = render(<TouchableLink externalNav={{ url }} testID={testID} />)
    const link = getByTestId(testID)
    expect(link.tagName.toLowerCase()).toBe('a')
    expect(link.getAttribute('href')).toBe(url)
  })

  it('should render with anchor tag if button component is given', async () => {
    const url = 'https://example.com'
    const buttonText = 'button'
    const { getByTestId } = render(
      <TouchableLink
        as={ButtonPrimary}
        wording={buttonText}
        externalNav={{ url }}
        testID={testID}
      />
    )
    const link = getByTestId(testID)

    expect(link.innerHTML).toContain(buttonText)
    expect(link.tagName.toLowerCase()).toBe('a')
    expect(link.getAttribute('href')).toBe(url)

    fireEvent.click(link)
    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
      expect(openUrl).toBeCalledWith(url, undefined)
    })
  })
})
