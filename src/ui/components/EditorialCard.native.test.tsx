import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { fireEvent, render, screen, userEvent } from 'tests/utils'

import { EditorialCard } from './EditorialCard'

const mockEditorialInfo = {
  imageURL: 'https://example.com/image.jpg',
  url: 'https://example.com/article',
  date: '24 March 2026',
  title: 'Main Title',
  subtitle: 'This is a subtitle',
  callToAction: 'Read More',
}

const defaultProps = {
  height: 200,
  width: 375, // Mobile by default
  isFocus: false,
  editorialCardInfo: mockEditorialInfo,
  accessibilityLabel: 'Editorial card link',
  onFocus: jest.fn(),
  onBlur: jest.fn(),
  onPress: jest.fn(),
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('EditorialCard Component', () => {
  it('should render correctly for mobile screens (width < 700)', () => {
    render(<EditorialCard {...defaultProps} />)

    expect(screen.getByTestId('imageBusiness')).toBeOnTheScreen()
    expect(screen.getByText(mockEditorialInfo.title)).toBeOnTheScreen()
    expect(screen.getByText(mockEditorialInfo.date)).toBeOnTheScreen()
  })

  it('should render correctly for large screens (width > 700)', () => {
    const largeScreenProps = { ...defaultProps, width: 800 }
    render(<EditorialCard {...largeScreenProps} />)

    expect(screen.getByTestId('imageBusiness')).toBeOnTheScreen()
    expect(screen.getByText(mockEditorialInfo.title)).toBeOnTheScreen()
    expect(screen.getByText(mockEditorialInfo.date)).toBeOnTheScreen()
  })

  it('should not render Call to Action section if callToAction is missing', () => {
    const infoWithoutCTA = { ...mockEditorialInfo, callToAction: undefined }
    render(<EditorialCard {...defaultProps} editorialCardInfo={infoWithoutCTA} />)

    expect(screen.queryByTestId('callToAction')).not.toBeOnTheScreen()
  })

  it('should be disabled and have no accessibility role if url is missing', () => {
    const infoWithoutUrl = { ...mockEditorialInfo, url: undefined }
    render(<EditorialCard {...defaultProps} editorialCardInfo={infoWithoutUrl} />)

    const touchable = screen.getByLabelText(defaultProps.accessibilityLabel)

    expect(touchable.props.accessibilityRole).toBeUndefined()
    expect(touchable.props.accessibilityState.disabled).toEqual(true)
  })

  it('should have LINK accessibility role if url is provided', () => {
    render(<EditorialCard {...defaultProps} />)

    const touchable = screen.getByLabelText(defaultProps.accessibilityLabel)

    expect(touchable.props.accessibilityRole).toEqual(AccessibilityRole.LINK)
  })

  it('should call onPress when the card is pressed', async () => {
    render(<EditorialCard {...defaultProps} />)

    await user.press(screen.getByLabelText(defaultProps.accessibilityLabel))

    expect(defaultProps.onPress).toHaveBeenCalledTimes(1)
  })

  it('should call onFocus and onBlur events', () => {
    render(<EditorialCard {...defaultProps} />)
    const touchable = screen.getByLabelText(defaultProps.accessibilityLabel)

    fireEvent(touchable, 'focus')

    expect(defaultProps.onFocus).toHaveBeenCalledTimes(1)

    fireEvent(touchable, 'blur')

    expect(defaultProps.onBlur).toHaveBeenCalledTimes(1)
  })

  it('should prevent default on mouse down to avoid focus issues on web-like environments', () => {
    render(<EditorialCard {...defaultProps} />)
    const touchable = screen.getByLabelText(defaultProps.accessibilityLabel)

    const mockPreventDefault = jest.fn()
    fireEvent(touchable, 'mouseDown', { preventDefault: mockPreventDefault })

    expect(mockPreventDefault).toHaveBeenCalledTimes(1)
  })
})
