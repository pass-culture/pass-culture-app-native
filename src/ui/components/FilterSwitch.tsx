import React from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'

import { testID } from 'tests/utils'
import { ColorsEnum, getShadow, getSpacing } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  active: boolean
  toggle: () => void
  testID: string
}

interface State {
  animatedValue: Animated.Value
}

const KNOB_OFFSET = getSpacing(5)

export default class FilterSwitch extends React.Component<Props, State> {
  static defaultProps = {
    active: false,
  }

  state = {
    animatedValue: new Animated.Value(this.props.active ? KNOB_OFFSET : 0),
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.active === this.props.active) {
      return
    }
    Animated.timing(this.state.animatedValue, {
      toValue: this.props.active ? KNOB_OFFSET : 0,
      easing: Easing.bezier(0, 0.75, 0, 0.75),
      duration: 250,
      useNativeDriver: false,
    }).start()
  }

  render() {
    const translateX = this.state.animatedValue
    return (
      <StyledTouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        active={this.props.active}
        onPress={() => this.props.toggle()}
        {...testID(this.props.testID)}>
        <StyledAnimatedView style={{ transform: [{ translateX }] }} />
      </StyledTouchableOpacity>
    )
  }
}

const StyledTouchableOpacity = styled.TouchableOpacity<{ active: boolean }>(({ active }) => ({
  backgroundColor: active ? ColorsEnum.GREEN_VALID : ColorsEnum.GREY_MEDIUM,
  width: getSpacing(14),
  height: getSpacing(8),
  paddingLeft: getSpacing(1),
  borderRadius: getSpacing(4),
  justifyContent: 'center',
}))

const StyledAnimatedView = styled(Animated.View)({
  aspectRatio: '1',
  width: getSpacing(7),
  height: getSpacing(7),
  backgroundColor: ColorsEnum.WHITE,
  borderRadius: getSpacing(7),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(0.5),
    },
    shadowRadius: 2.5,
    shadowColor: ColorsEnum.BLACK,
    shadowOpacity: 0.2,
  }),
})
