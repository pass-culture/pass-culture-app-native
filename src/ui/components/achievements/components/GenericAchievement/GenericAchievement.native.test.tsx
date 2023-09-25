import React from 'react'
import { Text, View } from 'react-native'

import { reset } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'

import {
  GenericAchievementCard,
  AchievementCardKeyProps,
} from '../GenericAchievementCard/GenericAchievementCard'

import { GenericAchievement, Props, onRemoveScreenAction } from './GenericAchievement'

const TestCard = (props: AchievementCardKeyProps) => (
  <View>
    <Text>{props.swiperRef ? 'swipeRef exist' : 'swipeRef does not exist'}</Text>
    <Text>{props.name ? 'name exist' : 'name does not exist'}</Text>
  </View>
)

describe('<GenericAchievement />', () => {
  it('should render correctly', () => {
    renderGenericAchievementComponent({
      screenName: 'EighteenBirthday',
      children: [<TestCard key={1} />],
    })

    expect(screen).toMatchSnapshot()
  })

  it('should redirect on home and run analytics when pressing skip all button', () => {
    const name = 'EighteenBirthday'
    renderGenericAchievementComponent({
      screenName: name,
      children: [
        <TestCard activeIndex={0} index={0} key={0} />,
        <TestCard activeIndex={0} index={1} key={1} />,
      ],
    })

    const skipAll = screen.getByText('Tout passer')
    fireEvent.press(skipAll)

    expect(reset).toHaveBeenCalledTimes(1)
    expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    expect(analytics.logHasSkippedTutorial).toHaveBeenCalledWith(`${name}1`)
  })

  it('should have a swiperRef passed to each children', () => {
    renderGenericAchievementComponent({
      screenName: 'EighteenBirthday',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })

    expect(screen.getByText('swipeRef exist')).toBeOnTheScreen()
    expect(() => screen.getByText('swipeRef does not exist')).toThrow()
  })

  it('should have an automatically set name passed to each children', () => {
    renderGenericAchievementComponent({
      screenName: 'EighteenBirthday',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })

    expect(screen.getByText('name exist')).toBeOnTheScreen()
    expect(() => screen.getByText('name does not exist')).toThrow()
  })

  it('should have a skip all button when more than one cards', () => {
    renderGenericAchievementComponent({
      screenName: 'EighteenBirthday',
      children: [
        <TestCard activeIndex={0} index={0} key={0} />,
        <TestCard activeIndex={0} index={1} key={1} />,
      ],
    })

    expect(screen.queryByText('Tout passer')).toBeOnTheScreen()
  })

  it('should not have a skip all button when just one cards', () => {
    renderGenericAchievementComponent({
      screenName: 'EighteenBirthday',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })

    expect(screen.queryByText('Tout passer')).not.toBeOnTheScreen()
  })

  it('should trigger analytics with a custom name instead of Achievement1', () => {
    const cardCustomName = 'Profile'
    renderGenericAchievementComponent({
      screenName: 'EighteenBirthday',
      children: [
        <GenericAchievementCard
          key={0}
          name={cardCustomName}
          animation={IlluminatedSmileyAnimation}
          buttonText={'Click'}
          pauseAnimationOnRenderAtFrame={0}
          subTitle={'Sub'}
          text={'Hello'}
          title={'Title'}
        />,
        <GenericAchievementCard
          key={1}
          animation={IlluminatedSmileyAnimation}
          buttonText={'Click'}
          pauseAnimationOnRenderAtFrame={0}
          subTitle={'Sub'}
          text={'Hello'}
          title={'Title'}
        />,
      ],
    })

    expect(analytics.logScreenView).toHaveBeenCalledWith(cardCustomName)

    const nextButton = screen.getByTestId('Continuer vers l’étape suivante')
    fireEvent.press(nextButton)

    expect(analytics.logScreenView).toHaveBeenCalledWith('EighteenBirthday2')
  })
})

function renderGenericAchievementComponent(props: Props) {
  return render(<GenericAchievement {...props} />)
}

describe('onRemoveScreenAction()', () => {
  const goBackEvent: any = { preventDefault: jest.fn(), data: { action: { type: 'GO_BACK' } } } // eslint-disable-line @typescript-eslint/no-explicit-any
  const popEvent: any = { preventDefault: jest.fn(), data: { action: { type: 'POP' } } } // eslint-disable-line @typescript-eslint/no-explicit-any
  const navigateEvent: any = { preventDefault: jest.fn(), data: { action: { type: 'NAVIGATE' } } } // eslint-disable-line @typescript-eslint/no-explicit-any
  const swiperRefValue = {
    getActiveIndex: jest.fn(() => 0),
    goTo: jest.fn(),
    goToPrev: jest.fn(),
    goToNext: jest.fn(),
    startAutoplay: jest.fn(),
    stopAutoplay: jest.fn(),
    setState: jest.fn(),
    forceUpdate: jest.fn(),
    render: jest.fn(),
    context: undefined,
    props: {},
    state: {},
    refs: {},
  }

  it('should NOT call goToPrev() or preventDefault() when action of event is NOT GO_BACK or POP', () => {
    onRemoveScreenAction({ swiperRefValue, event: navigateEvent })

    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(navigateEvent.preventDefault).not.toBeCalled()
  })

  it('should NOT call goToPrev() or preventDefault() when swiperRefValue is null', () => {
    onRemoveScreenAction({ swiperRefValue: null, event: goBackEvent })

    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(goBackEvent.preventDefault).not.toBeCalled()
  })

  it('should NOT call preventDefault() when activeIndex is 0', () => {
    onRemoveScreenAction({ swiperRefValue, event: goBackEvent })

    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(goBackEvent.preventDefault).not.toBeCalled()
  })

  it('should call goToPrev() and preventDefault() when activeIndex is not 0', () => {
    swiperRefValue.getActiveIndex.mockReturnValueOnce(1)
    onRemoveScreenAction({ swiperRefValue, event: goBackEvent })

    expect(swiperRefValue.goToPrev).toHaveBeenCalledTimes(1)
    expect(goBackEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should call goToPrev() and preventDefault() when activeIndex is not 0 and action type is POP', () => {
    swiperRefValue.getActiveIndex.mockReturnValueOnce(1)
    onRemoveScreenAction({ swiperRefValue, event: popEvent })

    expect(swiperRefValue.goToPrev).toHaveBeenCalledTimes(1)
    expect(popEvent.preventDefault).toHaveBeenCalledTimes(1)
  })
})
