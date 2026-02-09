import React from 'react'
import { Animated, View } from 'react-native'

import { render, screen, userEvent } from 'tests/utils'

import { OfferHeaderView } from '../OfferHeaderView'
import { OfferHeaderViewModel } from '../types'

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

const mockAnimationState = {
  iconBackgroundColor: new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>,
  iconBorderColor: new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>,
  transition: new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>,
}

const mockOnBackPress = jest.fn()
const mockOnSharePress = jest.fn()
const mockOnDismissShareModal = jest.fn()

const defaultViewModel: OfferHeaderViewModel = {
  title: 'Test Offer',
  animationState: mockAnimationState,
  shareModal: {
    isVisible: false,
    content: null,
    title: 'Partager l\u2019offre',
  },
  onBackPress: mockOnBackPress,
  onSharePress: mockOnSharePress,
  onDismissShareModal: mockOnDismissShareModal,
}

const headerTransition = new Animated.Value(0) as Animated.AnimatedInterpolation<string | number>

const user = userEvent.setup()

describe('<OfferHeaderView />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the share button', () => {
    renderOfferHeaderView()

    expect(screen.getByLabelText('Partager')).toBeOnTheScreen()
  })

  it('should render the back button', () => {
    renderOfferHeaderView()

    expect(screen.getByTestId('animated-icon-back')).toBeOnTheScreen()
  })

  it('should call onSharePress when share button is pressed', async () => {
    renderOfferHeaderView()

    await user.press(screen.getByLabelText('Partager'))

    expect(mockOnSharePress).toHaveBeenCalledTimes(1)
  })

  it('should call onBackPress when back button is pressed', async () => {
    renderOfferHeaderView()

    await user.press(screen.getByTestId('animated-icon-back'))

    expect(mockOnBackPress).toHaveBeenCalledTimes(1)
  })

  it('should render children', () => {
    renderOfferHeaderView(defaultViewModel, <View testID="test-child" />)

    expect(screen.getByTestId('test-child')).toBeOnTheScreen()
  })

  it('should not render share modal when content is null', () => {
    renderOfferHeaderView()

    expect(screen.queryByText('Partager l\u2019offre')).not.toBeOnTheScreen()
  })

  it('should render the offer title text', () => {
    renderOfferHeaderView()

    expect(screen.getByText('Test Offer')).toBeOnTheScreen()
  })

  it('should render the share icon button with correct accessibility label', () => {
    renderOfferHeaderView()

    expect(screen.getByTestId('animated-icon-share')).toBeOnTheScreen()
  })

  it('should render the header title', () => {
    renderOfferHeaderView()

    expect(screen.getByTestId('offerHeaderName')).toBeOnTheScreen()
  })

  it('should render without children', () => {
    renderOfferHeaderView(defaultViewModel)

    expect(screen.getByLabelText('Partager')).toBeOnTheScreen()
    expect(screen.getByTestId('animated-icon-back')).toBeOnTheScreen()
  })

  it('should render multiple children', () => {
    renderOfferHeaderView(
      defaultViewModel,
      <React.Fragment>
        <View testID="child-1" />
        <View testID="child-2" />
      </React.Fragment>
    )

    expect(screen.getByTestId('child-1')).toBeOnTheScreen()
    expect(screen.getByTestId('child-2')).toBeOnTheScreen()
  })
})

function renderOfferHeaderView(
  viewModel: OfferHeaderViewModel = defaultViewModel,
  children?: React.ReactNode
) {
  render(
    <OfferHeaderView viewModel={viewModel} headerTransition={headerTransition}>
      {children}
    </OfferHeaderView>
  )
}
