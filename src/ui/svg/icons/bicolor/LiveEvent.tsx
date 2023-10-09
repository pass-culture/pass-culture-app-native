import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const LiveEventSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="18.271%" x2="81.729%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M15.4831 3.5C15.4831 2.94614 15.9287 2.5 16.4819 2.5C17.0351 2.5 17.4806 2.94614 17.4806 3.5H17.1111C16.8353 3.5 16.6117 3.72386 16.6117 4C16.6117 4.27614 16.8353 4.5 17.1111 4.5H17.98H17.99H19.9775C20.5317 4.5 20.9888 4.94819 21.0012 5.50447L20.9763 18.449L20.9763 18.4575C20.9972 19.8545 19.8726 21 18.4794 21H5.49563C4.11849 21 2.99875 19.8789 2.99875 18.5V8.5H18.4894C18.7652 8.5 18.9888 8.27614 18.9888 8C18.9888 7.72386 18.7652 7.5 18.4894 7.5H2.99875V5.5C2.99875 4.94614 3.44434 4.5 3.9975 4.5H5.50563C5.50563 5.60614 6.39837 6.5 7.50313 6.5C7.77893 6.5 8.00251 6.27614 8.00251 6C8.00251 5.72386 7.77893 5.5 7.50313 5.5C6.94996 5.5 6.50438 5.05386 6.50438 4.5V3.5C6.50438 2.94614 6.94996 2.5 7.50313 2.5C8.0563 2.5 8.50188 2.94614 8.50188 3.5H8.12235C7.84655 3.5 7.62298 3.72386 7.62298 4C7.62298 4.27614 7.84655 4.5 8.12235 4.5H9.00125H9.00126H14.4844C14.4844 5.60614 15.3771 6.5 16.4819 6.5C16.7577 6.5 16.9813 6.27614 16.9813 6C16.9813 5.72386 16.7577 5.5 16.4819 5.5C15.9287 5.5 15.4831 5.05386 15.4831 4.5V4.10003C15.4897 4.06771 15.4931 4.03426 15.4931 4C15.4931 3.96574 15.4897 3.93229 15.4831 3.89997V3.5ZM14.4844 3.5H9.50063C9.50063 2.39386 8.60789 1.5 7.50313 1.5C6.39837 1.5 5.50563 2.39386 5.50563 3.5H3.9975C2.89274 3.5 2 4.39386 2 5.5V18.5C2 20.4311 3.5669 22 5.49563 22H18.4794C20.4306 22 22.0017 20.398 21.975 18.4469L22 5.50097L21.9999 5.49097C21.98 4.38936 21.0797 3.5 19.9775 3.5H18.4794C18.4794 2.39386 17.5867 1.5 16.4819 1.5C15.3771 1.5 14.4844 2.39386 14.4844 3.5ZM14.5136 13.2228L11.2706 11.5938C10.6885 11.2983 10.01 11.7275 10.01 12.37V15.635C10.01 16.2775 10.6885 16.7067 11.2705 16.4113L14.5144 14.7818L14.5145 14.7818L14.5202 14.7789C15.1432 14.4558 15.1588 13.5458 14.5141 13.223L14.5136 13.2228ZM13.838 14.0025L11.01 12.582V15.4231L13.838 14.0025Z"
      />
    </AccessibleSvg>
  )
}

export const LiveEvent = styled(LiveEventSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
