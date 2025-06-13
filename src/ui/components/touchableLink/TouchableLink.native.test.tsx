import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Typo } from 'ui/theme'

import { TouchableLink } from './TouchableLink'

const handleNavigationMock = jest.fn()

const linkText = 'linkText'
const TouchableLinkContent = () => <Typo.Body>{linkText}</Typo.Body>

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
