import React from 'react'
import { Text } from 'react-native'

import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent, screen, waitFor } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { TouchableLink } from './TouchableLink'

const handleNavigationMock = jest.fn()

const linkText = 'linkText'
const TouchableLinkContent = () => <Text>{linkText}</Text>

describe('<TouchableLink />', () => {
  describe('Internal Navigation', () => {
    it('should fire onBeforeNavigate if given, before navigation', async () => {
      render(
        <TouchableLink
          handleNavigation={handleNavigationMock}
          onBeforeNavigate={() => analytics.logConsultTutorial('profile')}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

      expect(analytics.logConsultTutorial).toHaveBeenCalledWith('profile')
      expect(handleNavigationMock).not.toHaveBeenCalled()
      await waitFor(() => {
        expect(handleNavigationMock).toHaveBeenCalledTimes(1)
      })
    })

    it('should fire onAfterNavigate after navigate', async () => {
      const mockedOnAfterNavigate = jest.fn()
      render(
        <TouchableLink
          handleNavigation={handleNavigationMock}
          onAfterNavigate={mockedOnAfterNavigate}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

      expect(handleNavigationMock).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(mockedOnAfterNavigate).toHaveBeenCalledTimes(1)
      })
    })

    it('should render with correct style if component tag is given', () => {
      const buttonText = 'button'
      render(
        <TouchableLink
          as={ButtonPrimary}
          wording={buttonText}
          handleNavigation={handleNavigationMock}
        />
      )
      const expectedStyle = screen.getByText(buttonText).props.style
      const link = screen.getByText(buttonText)

      expect(screen.getByText(buttonText)).toBeTruthy()
      expect(link.props.style).toEqual(expectedStyle)
    })
  })
})
