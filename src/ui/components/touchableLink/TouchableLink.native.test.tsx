import React from 'react'
import { Text } from 'react-native'

import { analytics } from 'libs/analytics'
import { act, render, screen, userEvent } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { TouchableLink } from './TouchableLink'

const handleNavigationMock = jest.fn()

const linkText = 'linkText'
const TouchableLinkContent = () => <Text>{linkText}</Text>

describe('<TouchableLink />', () => {
  const user = userEvent.setup()

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Internal Navigation', () => {
    it('should fire onBeforeNavigate if given, before navigation', async () => {
      render(
        <TouchableLink
          handleNavigation={handleNavigationMock}
          onBeforeNavigate={() => analytics.logConsultTutorial({ from: 'profile' })}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      await user.press(screen.getByText(linkText))

      expect(analytics.logConsultTutorial).toHaveBeenCalledWith({ from: 'profile' })

      expect(handleNavigationMock).toHaveBeenCalledTimes(1)
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

      await user.press(screen.getByText(linkText))

      expect(handleNavigationMock).toHaveBeenCalledTimes(1)

      expect(mockedOnAfterNavigate).toHaveBeenCalledTimes(1)
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

    it('should trigger handleNavigation only once in case of press spamming with correct cooldown delay', async () => {
      render(
        <TouchableLink handleNavigation={handleNavigationMock} pressCooldownDelay={300}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      await user.press(screen.getByText(linkText))
      await user.press(screen.getByText(linkText))
      await user.press(screen.getByText(linkText))

      expect(handleNavigationMock).toHaveBeenCalledTimes(1)
    })

    it('should trigger handleNavigation multiple time if cooldown delay is respected', async () => {
      render(
        <TouchableLink handleNavigation={handleNavigationMock} pressCooldownDelay={300}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      await act(async () => {
        await user.press(screen.getByText(linkText))

        jest.advanceTimersByTime(300)

        await user.press(screen.getByText(linkText))

        jest.advanceTimersByTime(300)

        await user.press(screen.getByText(linkText))
      })

      expect(handleNavigationMock).toHaveBeenCalledTimes(3)
    })

    it('should trigger handleNavigation with multiple press when no cooldown delay is set', async () => {
      jest.useFakeTimers()
      render(
        <TouchableLink handleNavigation={handleNavigationMock}>
          <TouchableLinkContent />
        </TouchableLink>
      )

      await user.press(screen.getByText(linkText))
      await user.press(screen.getByText(linkText))
      await user.press(screen.getByText(linkText))

      expect(handleNavigationMock).toHaveBeenCalledTimes(3)
    })

    it('should not trigger handleNavigation when Link is disabled', async () => {
      render(
        <TouchableLink handleNavigation={handleNavigationMock} disabled>
          <TouchableLinkContent />
        </TouchableLink>
      )

      await user.press(screen.getByText(linkText))

      expect(handleNavigationMock).not.toHaveBeenCalledTimes(3)
    })
  })
})
