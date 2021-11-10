import { SvgProps } from 'react-native-svg'

import { IconInterface } from 'ui/svg/icons/types'

export function mapIconPropsToSvgProps(props: IconInterface): SvgProps {
  const { color, size, style, testID } = props
  return {
    width: size,
    height: size,
    style,
    fill: color,
    testID,
  }
}
