import React from 'react'
import { SwiperProps } from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { Dot } from 'ui/svg/icons/Dot'
import { ColorsEnum, getSpacing } from 'ui/theme'

const CURRENT_STEP_SIZE = 12
const DEFAULT_SIZE = 8

type DotComponentProps = SwiperProps & {
  isActive?: boolean
}

// Class typing forced due to https://github.com/reactrondev/react-native-web-swiper/issues/56
export class DotComponent extends React.Component<DotComponentProps> {
  render() {
    const { isActive } = this.props
    return (
      <DotContainer>
        <Dot
          color={isActive ? ColorsEnum.PRIMARY : ColorsEnum.GREY_MEDIUM}
          size={isActive ? CURRENT_STEP_SIZE : DEFAULT_SIZE}
          testID="dot-icon"
        />
      </DotContainer>
    )
  }
}

const DotContainer = styled.View({
  alignSelf: 'center',
  marginLeft: getSpacing(2),
  marginRight: getSpacing(2),
})
