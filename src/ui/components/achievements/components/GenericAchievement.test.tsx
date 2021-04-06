import React from 'react'
import { Text, View } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'

import { GenericAchievement, Props } from './GenericAchievement'
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
      name: 'FirstAchievement',
      children: [<TestCard key={1} />],
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect on home and run analytics when pressing skip all button', async () => {
    const name = 'FirstAchievement'
    const { getByText } = renderGenericAchievementComponent({
      name: name,
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
      name: 'FirstAchievement',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })
    expect(getByText('swipeRef exist')).toBeTruthy()
    expect(() => getByText('swipeRef does not exist')).toThrow()
  })

  it('should have an automatically set name passed to each children', async () => {
    const { getByText } = renderGenericAchievementComponent({
      name: 'Achievement',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })
    expect(await getByText('name exist')).toBeTruthy()
    expect(() => getByText('name does not exist')).toThrow()
  })

  it('should call skip custom function on skip', async () => {
    const skip = jest.fn()
    const { getByText } = renderGenericAchievementComponent({
      name: 'Achievement',
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
      name: 'Achievement',
      children: [
        <TestCard activeIndex={0} index={0} key={0} />,
        <TestCard activeIndex={0} index={1} key={1} />,
      ],
    })
    expect(queryByText('Tout passer')).toBeTruthy()
  })

  it('should not have a skip all button when just one cards', () => {
    const { queryByText } = renderGenericAchievementComponent({
      name: 'Achievement',
      children: [<TestCard activeIndex={0} index={0} key={0} />],
    })
    expect(queryByText('Tout passer')).toBeFalsy()
  })

  it('should trigger analytics with a custom name instead of Achievement1', async () => {
    const cardCustomName = 'CustomName'
    const { getByTestId } = renderGenericAchievementComponent({
      name: 'Achievement',
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
    const next = await getByTestId('controlButton')
    fireEvent.press(next)
    await waitForExpect(() => {
      expect(analytics.logScreenView).toHaveBeenCalledWith('Achievement2')
    })
  })
})

function renderGenericAchievementComponent(props: Props) {
  return render(<GenericAchievement {...props} />)
}
