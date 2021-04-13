import React from 'react'
import { Text, View } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'

import { GenericAchievement, Props, onBackAction } from './GenericAchievement'
import { GenericAchievementCard, AchievementCardKeyProps } from './GenericAchievementCard'

describe('<GenericAchievement />', () => {
  beforeEach(jest.clearAllMocks)

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
    expect(navigate).toHaveBeenCalledWith(homeNavigateConfig.screen, homeNavigateConfig.params)
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
      expect(skip).toHaveBeenCalled()
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
    expect(queryByText('Tout passer')).toBeFalsy()
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
    const next = getByTestId('controlButton')
    fireEvent.press(next)
    await waitForExpect(() => {
      expect(analytics.logScreenView).toHaveBeenCalledWith('FirstTutorial2')
    })
  })
})

function renderGenericAchievementComponent(props: Props) {
  return render(<GenericAchievement {...props} />)
}

describe('onBackAction', () => {
  afterEach(jest.clearAllMocks)

  const onFirstCardBackAction = jest.fn()
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

  it('should return true swiperRefValue is null', () => {
    const result = onBackAction(null, onFirstCardBackAction)

    expect(result).toBe(true)
    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).not.toBeCalled()
  })

  it('should return false and not call onFirstCardBackAction() when it is not defined and activeIndex is 0', () => {
    const result = onBackAction(swiperRefValue, undefined)

    expect(result).toBe(false)
    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).not.toBeCalled()
  })

  it('should call onFirstCardBackAction() when it is defined and activeIndex is 0', () => {
    const result = onBackAction(swiperRefValue, onFirstCardBackAction)

    expect(result).toBe(true)
    expect(onFirstCardBackAction).toBeCalled()
    expect(swiperRefValue.goToPrev).not.toBeCalled()
  })

  it('should call swiperRefValue.goToPrev() when activeIndex is not 0', () => {
    swiperRefValue.getActiveIndex.mockReturnValueOnce(1)
    const result = onBackAction(swiperRefValue, onFirstCardBackAction)

    expect(result).toBe(true)
    expect(onFirstCardBackAction).not.toBeCalled()
    expect(swiperRefValue.goToPrev).toBeCalled()
  })
})
