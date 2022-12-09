import React from 'react'
import { Text } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { TouchableLink } from './TouchableLink'

const handleNavigationMock = jest.fn()

const linkText = 'linkText'
const TouchableLinkContent = () => <Text>{linkText}</Text>

describe('<TouchableLink />', () => {
  describe('Internal Navigation', () => {
    it('should fire onBeforeNavigate if given, before navigation', async () => {
      const { getByText } = render(
        <TouchableLink
          handleNavigation={handleNavigationMock}
          onBeforeNavigate={() => analytics.logConsultTutorial('profile')}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))
      expect(analytics.logConsultTutorial).toHaveBeenCalledWith('profile')
      expect(handleNavigationMock).not.toHaveBeenCalled()
      await waitForExpect(() => {
        expect(handleNavigationMock).toHaveBeenCalledTimes(1)
      })
    })

    it('should fire onAfterNavigate after navigate', async () => {
      const mockedOnAfterNavigate = jest.fn()
      const { getByText } = render(
        <TouchableLink
          handleNavigation={handleNavigationMock}
          onAfterNavigate={mockedOnAfterNavigate}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(getByText(linkText))

      expect(handleNavigationMock).toHaveBeenCalledTimes(1)
      await waitForExpect(() => {
        expect(mockedOnAfterNavigate).toHaveBeenCalledTimes(1)
      })
    })

    it('should render with correct style if component tag is given', () => {
      const buttonText = 'button'
      const { getByText: getButtonByText } = render(<ButtonPrimary wording={buttonText} />)
      const { getByText } = render(
        <TouchableLink
          as={ButtonPrimary}
          wording={buttonText}
          handleNavigation={handleNavigationMock}
        />
      )
      const expectedStyle = getButtonByText(buttonText).props.style
      const link = getByText(buttonText)

      expect(getByText(buttonText)).toBeTruthy()
      expect(link.props.style).toEqual(expectedStyle)
    })
  })
})
