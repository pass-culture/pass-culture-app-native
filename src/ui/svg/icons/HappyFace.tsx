import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const HappyFaceSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 18C133.137 18 160 44.8629 160 78C160 91.3909 155.594 104.123 147.605 114.525C146.542 115.907 144.559 116.167 143.176 115.105C141.793 114.042 141.534 112.059 142.595 110.677C149.746 101.37 153.685 89.9874 153.685 78C153.685 48.3509 129.649 24.3154 100 24.3154C70.3486 24.3154 46.3154 48.3497 46.3154 78C46.3154 107.65 70.3486 131.685 100 131.685C107.271 131.685 114.341 130.238 120.894 127.467C122.501 126.789 124.353 127.541 125.032 129.147C125.712 130.753 124.96 132.606 123.353 133.285C116.025 136.382 108.119 138 100 138C66.8606 138 40 111.138 40 78C40 44.8617 66.8606 18 100 18ZM77.456 83.9817C84.496 89.8206 93.6537 92.6846 103.071 91.7703C109.893 91.1074 116.223 88.5246 121.438 84.3874C122.839 83.2766 124.853 83.5577 125.937 85.016C127.021 86.4731 126.765 88.5554 125.363 89.6674C119.203 94.5531 111.737 97.5988 103.717 98.3794C92.6331 99.4548 81.8137 96.0708 73.4674 89.1497C72.08 88 71.8491 85.9109 72.9497 84.4834C74.0514 83.056 76.0697 82.832 77.456 83.9817ZM82.8571 66C85.0686 66 86.8571 67.792 86.8571 70C86.8571 72.2126 85.0686 74 82.8571 74C80.6491 74 78.8571 72.2126 78.8571 70C78.8571 67.792 80.6491 66 82.8571 66ZM116 66C118.208 66 120 67.792 120 70C120 72.2126 118.208 74 116 74C113.789 74 112 72.2126 112 70C112 67.792 113.789 66 116 66Z"
      />
    </AccessibleSvg>
  )
}

export const HappyFace = styled(HappyFaceSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.illustrations.sizes.medium,
}))``
