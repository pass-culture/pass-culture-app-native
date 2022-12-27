import React from 'react'
import { Text, View } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { reset } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'

import {
  GenericAchievementCard,
  AchievementCardKeyProps,
} from '../GenericAchievementCard/GenericAchievementCard'

import { GenericAchievement, Props, onRemoveScreenAction } from './GenericAchievement'

describe('<GenericAchievement />', () => {
  const TestCard = (props: AchievementCardKeyProps) => (
    <View>
      <Text>{props.swiperRef ? 'swipeRef exist' : 'swipeRef does not exist'}</Text>
      <Text>{props.name ? 'name exist' : 'name does not exist'}</Text>
    </View>
  )

  it('should render correctly', () => {
    const renderAPI = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
      children: [<TestCard key={1} />],
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect on home and run analytics when pressing skip all button', async () => {
    const name = 'FirstTutorial'
    const { getByText } = renderGenericAchievementComponent({
      screenName: name,
      children: [
        <TestCard activeIndex={0} index={0} key={0} />,
        <TestCard activeIndex={0} index={1} key={1} />,
      ],
    })
    const skipAll = await getByText('Tout passer')
    fireEvent.press(skipAll)
    expect(reset).toHaveBeenCalledTimes(1)
    expect(reset).toHaveBeenCalledWith({ index: 0, routes: [{ name: homeNavConfig[0] }] })
    expect(analytics.logHasSkippedTutorial).toHaveBeenCalledWith(`${name}1`)
  })

  it('should have a swiperRef passed to each children', () => {
    const { getByText } = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })
    expect(getByText('swipeRef exist')).toBeTruthy()
    expect(() => getByText('swipeRef does not exist')).toThrow()
  })

  it('should have an automatically set name passed to each children', async () => {
    const { getByText } = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })
    expect(await getByText('name exist')).toBeTruthy()
    expect(() => getByText('name does not exist')).toThrow()
  })

  it('should call skip custom function on skip', async () => {
    const skip = jest.fn()
    const { getByText } = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
      children: [
        <TestCard activeIndex={0} index={0} key={0} />,
        <TestCard activeIndex={0} index={0} key={0} />,
      ],
      skip,
    })
    const button = await getByText('Tout passer')
    fireEvent.press(button)
    await waitForExpect(() => {
      expect(skip).toHaveBeenCalledTimes(1)
    })
  })

  it('should have a skip all button when more than one cards', () => {
    const { queryByText } = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
      children: [
        <TestCard activeIndex={0} index={0} key={0} />,
        <TestCard activeIndex={0} index={1} key={1} />,
      ],
    })
    expect(queryByText('Tout passer')).toBeTruthy()
  })

  it('should not have a skip all button when just one cards', () => {
    const { queryByText } = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })
    expect(queryByText('Tout passer')).toBeNull()
  })

  it('should trigger analytics with a custom name instead of Achievement1', async () => {
    const cardCustomName = 'CustomName'
    const { getByTestId } = renderGenericAchievementComponent({
      screenName: 'FirstTutorial',
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
    const next = getByTestId('Continuer vers l’étape suivante')
    fireEvent.press(next)
    await waitForExpect(() => {
      expect(analytics.logScreenView).toHaveBeenCalledWith('FirstTutorial2')
    })
  })
})

function renderGenericAchievementComponent(props: Props) {
  return render(<GenericAchievement {...props} />)
}

describe('onRemoveScreenAction()', () => {
  const onFirstCardBackAction = jest.fn()
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

  it('should NOT call onFirstCardBackAction(), goToPrev() or preventDefault() when action of event is NOT GO_BACK or POP', () => {
    onRemoveScreenAction({ swiperRefValue, onFirstCardBackAction, event: navigateEvent })

    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(navigateEvent.preventDefault).not.toBeCalled()
  })

  it('should NOT call onFirstCardBackAction(), goToPrev() or preventDefault() when swiperRefValue is null', () => {
    onRemoveScreenAction({ swiperRefValue: null, onFirstCardBackAction, event: goBackEvent })

    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(goBackEvent.preventDefault).not.toBeCalled()
  })

  it('should NOT call onFirstCardBackAction() or preventDefault() when onFirstCardBackAction is NOT defined and activeIndex is 0', () => {
    onRemoveScreenAction({ swiperRefValue, onFirstCardBackAction: undefined, event: goBackEvent })

    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(goBackEvent.preventDefault).not.toBeCalled()
  })

  it('should call onFirstCardBackAction() and preventDefault() when onFirstCardBackAction is defined and activeIndex is 0', () => {
    onRemoveScreenAction({ swiperRefValue, onFirstCardBackAction, event: goBackEvent })

    expect(onFirstCardBackAction).toHaveBeenCalledTimes(1)
    expect(swiperRefValue.goToPrev).not.toBeCalled()
    expect(goBackEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should call goToPrev() and preventDefault() when activeIndex is not 0', () => {
    swiperRefValue.getActiveIndex.mockReturnValueOnce(1)
    onRemoveScreenAction({ swiperRefValue, onFirstCardBackAction, event: goBackEvent })

    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).toHaveBeenCalledTimes(1)
    expect(goBackEvent.preventDefault).toHaveBeenCalledTimes(1)
  })

  it('should call goToPrev() and preventDefault() when activeIndex is not 0 and action type is POP', () => {
    swiperRefValue.getActiveIndex.mockReturnValueOnce(1)
    onRemoveScreenAction({ swiperRefValue, onFirstCardBackAction, event: popEvent })

    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).toHaveBeenCalledTimes(1)
    expect(popEvent.preventDefault).toHaveBeenCalledTimes(1)
  })
})
