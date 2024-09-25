import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const CameraSvg: React.FunctionComponent<AccessibleIcon> = ({
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
            viewBox="0 0 24 24"
            accessibilityLabel={accessibilityLabel}
            testID={testID}>
            <Path
                d="M1,19.5 L1,7.5 C1,6.11928813 2.11928813,5 3.5,5 L5.42963248,5 C5.93116226,5 6.39950926,4.7493483 6.67770792,4.33205029 L7.49024178,3.11324951 C7.95390623,2.41775284 8.73448455,2 9.57036752,2 L14.4296325,2 C15.2655155,2 16.0460938,2.41775284 16.5097582,3.11324951 L17.3222921,4.33205029 C17.6004907,4.7493483 18.0688377,5 18.5703675,5 L20.5,5 C21.8807119,5 23,6.11928813 23,7.5 L23,19.5 C23,20.8807119 21.8807119,22 20.5,22 L3.5,22 C2.11928813,22 1,20.8807119 1,19.5 Z M2,19.5 C2,20.3284271 2.67157288,21 3.5,21 L20.5,21 C21.3284271,21 22,20.3284271 22,19.5 L22,7.5 C22,6.67157288 21.3284271,6 20.5,6 L18.5703675,6 C17.7344845,6 16.9539062,5.58224716 16.4902418,4.88675049 L15.6777079,3.66794971 C15.3995093,3.2506517 14.9311623,3 14.4296325,3 L9.57036752,3 C9.06883774,3 8.60049074,3.2506517 8.32229208,3.66794971 L7.50975822,4.88675049 C7.04609377,5.58224716 6.26551545,6 5.42963248,6 L3.5,6 C2.67157288,6 2,6.67157288 2,7.5 L2,19.5 Z M12,19 C8.6862915,19 6,16.3137085 6,13 C6,9.6862915 8.6862915,7 12,7 C15.3137085,7 18,9.6862915 18,13 C18,16.3137085 15.3137085,19 12,19 Z M12,18 C14.7614237,18 17,15.7614237 17,13 C17,10.2385763 14.7614237,8 12,8 C9.23857625,8 7,10.2385763 7,13 C7,15.7614237 9.23857625,18 12,18 Z"
                fill={color}
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </AccessibleSvg>
    )
}

export const Camera = styled(CameraSvg).attrs(({ color, size, theme }) => ({
    color: color ?? theme.colors.black,
    size: size ?? theme.illustrations.sizes.medium,
}))``
