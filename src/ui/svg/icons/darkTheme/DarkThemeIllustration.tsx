import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

export const DarkThemeIllustration = () => {
  const { designSystem } = useTheme()
  const { id } = svgIdentifier()

  return (
    <AccessibleSvg width="62" height="108" viewBox="0 0 62 108" fill="none">
      <Rect
        x="0.5"
        y="0.5"
        width="61"
        height="107"
        rx="4"
        fill="none"
        stroke={designSystem.color.background.locked}
        strokeWidth={1}
      />
      <G clipPath={`url(#${id})`}>
        <Rect
          x="2"
          y="1"
          width="58"
          height="104"
          rx="4"
          fill={designSystem.color.background.lockedInverted}
        />
        <Path
          d="M26.2607 56H8.74325C7.78156 56 7.00195 56.7766 7.00195 57.7347V85.2653C7.00195 86.2234 7.78156 87 8.74325 87H26.2607C27.2223 87 28.002 86.2234 28.002 85.2653V57.7347C28.002 56.7766 27.2223 56 26.2607 56Z"
          fill="#A7A7A7"
        />
        <Rect
          x="7"
          y="92"
          width="18"
          height="2"
          rx="1"
          fill={designSystem.color.background.locked}
        />
        <Rect
          x="7"
          y="89"
          width="8"
          height="2"
          rx="1"
          fill={designSystem.color.background.lockedBrandPrimary}
        />
        <Path
          d="M27.2074 95.9995H8.79628C8.35752 95.9995 8.00183 96.4109 8.00183 96.9183V97.0808C8.00183 97.5882 8.35752 97.9995 8.79628 97.9995H27.2074C27.6461 97.9995 28.0018 97.5882 28.0018 97.0808V96.9183C28.0018 96.4109 27.6461 95.9995 27.2074 95.9995Z"
          fill="#5E5E5E"
        />
        <Path
          d="M49.3436 56H32.6603C31.7444 56 31.002 56.7766 31.002 57.7347V85.2653C31.002 86.2234 31.7444 87 32.6603 87H49.3436C50.2595 87 51.002 86.2234 51.002 85.2653V57.7347C51.002 56.7766 50.2595 56 49.3436 56Z"
          fill="#A7A7A7"
        />
        <Rect
          x="31"
          y="92"
          width="18"
          height="2"
          rx="1"
          fill={designSystem.color.background.locked}
        />
        <Rect
          x="31"
          y="89"
          width="8"
          height="2"
          rx="1"
          fill={designSystem.color.background.lockedBrandPrimary}
        />
        <Path
          d="M51.2074 95.9995H32.7963C32.3575 95.9995 32.0018 96.4109 32.0018 96.9183V97.0808C32.0018 97.5882 32.3575 97.9995 32.7963 97.9995H51.2074C51.6461 97.9995 52.0018 97.5882 52.0018 97.0808V96.9183C52.0018 96.4109 51.6461 95.9995 51.2074 95.9995Z"
          fill="#5E5E5E"
        />
        <Path
          d="M68.002 87H55.6253C54.7292 87 54.002 86.2229 54.002 85.2653V57.7347C54.002 56.7771 54.7292 56 55.6253 56H68.002V87Z"
          fill="#A7A7A7"
        />
        <Rect
          x="54"
          y="92"
          width="18"
          height="2"
          rx="1"
          fill={designSystem.color.background.locked}
        />
        <Rect
          x="54"
          y="89"
          width="8"
          height="2"
          rx="1"
          fill={designSystem.color.background.lockedBrandPrimary}
        />
        <Path
          d="M56.745 95.9995H60.0018V97.9995H56.745C56.3345 97.9995 56.0018 97.5883 56.0018 97.0808V96.9183C56.0018 96.4107 56.3345 95.9995 56.745 95.9995Z"
          fill="#5E5E5E"
        />
        <Path d="M60.002 95H2.00195V105H60.002V95Z" fill="#494949" />
        <Path
          d="M11.9598 95.8867H8.67987C8.07605 95.8867 7.58655 96.3752 7.58655 96.9778V100.251C7.58655 100.854 8.07605 101.342 8.67987 101.342H11.9598C12.5637 101.342 13.0532 100.854 13.0532 100.251V96.9778C13.0532 96.3752 12.5637 95.8867 11.9598 95.8867Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M12.5019 102.393H8.1397C7.8096 102.393 7.54199 102.659 7.54199 102.988C7.54199 103.317 7.8096 103.584 8.1397 103.584H12.5019C12.832 103.584 13.0996 103.317 13.0996 102.988C13.0996 102.659 12.832 102.393 12.5019 102.393Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M25.91 95.8867H22.6301C22.0262 95.8867 21.5367 96.3752 21.5367 96.9778V100.251C21.5367 100.854 22.0262 101.342 22.6301 101.342H25.91C26.5139 101.342 27.0034 100.854 27.0034 100.251V96.9778C27.0034 96.3752 26.5139 95.8867 25.91 95.8867Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M26.4521 102.393H22.0899C21.7598 102.393 21.4922 102.659 21.4922 102.988C21.4922 103.317 21.7598 103.584 22.0899 103.584H26.4521C26.7822 103.584 27.0498 103.317 27.0498 102.988C27.0498 102.659 26.7822 102.393 26.4521 102.393Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M39.8622 95.8867H36.5822C35.9784 95.8867 35.4889 96.3752 35.4889 96.9778V100.251C35.4889 100.854 35.9784 101.342 36.5822 101.342H39.8622C40.466 101.342 40.9555 100.854 40.9555 100.251V96.9778C40.9555 96.3752 40.466 95.8867 39.8622 95.8867Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M40.4022 102.393H36.0401C35.71 102.393 35.4424 102.659 35.4424 102.988C35.4424 103.317 35.71 103.584 36.0401 103.584H40.4022C40.7324 103.584 41 103.317 41 102.988C41 102.659 40.7324 102.393 40.4022 102.393Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M53.8124 95.8867H50.5324C49.9286 95.8867 49.4391 96.3752 49.4391 96.9778V100.251C49.4391 100.854 49.9286 101.342 50.5324 101.342H53.8124C54.4162 101.342 54.9057 100.854 54.9057 100.251V96.9778C54.9057 96.3752 54.4162 95.8867 53.8124 95.8867Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M54.3544 102.393H49.9922C49.6621 102.393 49.3945 102.659 49.3945 102.988C49.3945 103.317 49.6621 103.584 49.9922 103.584H54.3544C54.6845 103.584 54.9521 103.317 54.9521 102.988C54.9521 102.659 54.6845 102.393 54.3544 102.393Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M52.9441 22H9.04365C7.8481 22 6.87891 22.9672 6.87891 24.1603V35.1017C6.87891 36.2948 7.8481 37.262 9.04365 37.262H52.9441C54.1397 37.262 55.1089 36.2948 55.1089 35.1017V24.1603C55.1089 22.9672 54.1397 22 52.9441 22Z"
          fill={designSystem.color.background.locked}
        />
        <Path
          d="M52.9439 22.1746C54.0412 22.1746 54.9337 23.0653 54.9337 24.1603V35.1034C54.9337 36.1984 54.0412 37.0891 52.9439 37.0891H9.0417C7.94445 37.0891 7.05195 36.1984 7.05195 35.1034V24.1603C7.05195 23.0653 7.94445 22.1746 9.0417 22.1746H52.9422M52.9439 22H9.0417C7.84645 22 6.87695 22.9675 6.87695 24.1603V35.1034C6.87695 36.2962 7.84645 37.2638 9.0417 37.2638H52.9422C54.1374 37.2638 55.1069 36.2962 55.1069 35.1034V24.1603C55.1069 22.9675 54.1374 22 52.9422 22H52.9439Z"
          fill="#5B5B5B"
        />
        <Rect x="10" y="33.4766" width="21" height="1" rx="0.5" fill="#D9D9D9" />
        <Rect
          x="10"
          y="25.4766"
          width="16"
          height="2"
          rx="1"
          fill={designSystem.color.background.lockedBrandPrimary}
        />
        <Rect x="10" y="29.4766" width="32" height="3" rx="1.5" fill="#D9D9D9" />
        <Rect x="7" y="47" width="36" height="2" rx="1" fill="#D9D9D9" />
        <Rect x="7" y="50" width="26" height="2" rx="1" fill="#D9D9D9" />
        <Rect x="7" y="42" width="14" height="3" rx="1.5" fill="#D9D9D9" />
        <Rect
          x="7"
          y="16"
          width="16"
          height="2"
          rx="1"
          fill={designSystem.color.background.lockedBrandPrimary}
        />
        <Rect x="7" y="9" width="32" height="5" rx="2.5" fill="#D9D9D9" />
      </G>
      <Defs>
        <ClipPath id={id}>
          <Rect
            x="2"
            y="1"
            width="58"
            height="104"
            rx="4"
            fill={designSystem.color.background.locked}
          />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
