import React from 'react'
import { Text } from 'react-native'

import { analytics } from 'libs/analytics'
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
          onBeforeNavigate={() => analytics.logConsultTutorial({ from: 'profile' })}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

      expect(analytics.logConsultTutorial).toHaveBeenCalledWith({ from: 'profile' })
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

      expect(screen.getByText(buttonText)).toBeOnTheScreen()
      expect(link.props.style).toEqual(expectedStyle)
    })

    it('should trigger handleNavigation only once in case of press spamming', async () => {
      render(
        <TouchableLink handleNavigation={handleNavigationMock}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))
      fireEvent.press(screen.getByText(linkText))
      fireEvent.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(handleNavigationMock).toHaveBeenCalledTimes(1)
      })
    })

    it('should trigger handleNavigation with multiple press respecting cooldown delay', async () => {
      jest.useFakeTimers()
      render(
        <TouchableLink handleNavigation={handleNavigationMock}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))
      jest.advanceTimersByTime(400)
      fireEvent.press(screen.getByText(linkText))
      jest.advanceTimersByTime(400)
      fireEvent.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(handleNavigationMock).toHaveBeenCalledTimes(3)
      })
    })

    it('should not trigger handleNavigation when Link is disabled', async () => {
      jest.useFakeTimers()
      render(
        <TouchableLink handleNavigation={handleNavigationMock} disabled>
          <TouchableLinkContent />
        </TouchableLink>
      )

      fireEvent.press(screen.getByText(linkText))

      await waitFor(() => {
        expect(handleNavigationMock).not.toHaveBeenCalledTimes(3)
      })
    })
  })
})
