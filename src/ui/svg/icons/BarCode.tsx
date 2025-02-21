import React from 'react'
import { Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

export const BarCode: React.FC<AccessibleIcon> = (props) => {
  return (
    <AccessibleSvg width={41} height={32} viewBox="0 0 41 32" fill="none" {...props}>
      <Path
        d="M2.5 3a1 1 0 011-1H12a1 1 0 100-2H3.5a3 3 0 00-3 3v6.5a1 1 0 102 0V3zM29 0a1 1 0 100 2h8.5a1 1 0 011 1v6.5a1 1 0 102 0V3a3 3 0 00-3-3H29zM2.5 22.5a1 1 0 10-2 0V29a3 3 0 003 3H12a1 1 0 100-2H3.5a1 1 0 01-1-1v-6.5zM40.5 22.5a1 1 0 10-2 0V29a1 1 0 01-1 1H29a1 1 0 100 2h8.5a3 3 0 003-3v-6.5z"
        fill="#000"
      />
      <Path
        d="M7.5 8a1 1 0 10-2 0v16a1 1 0 102 0V8zM34.5 7a1 1 0 011 1v10a1 1 0 11-2 0V8a1 1 0 011-1zM35.5 22a1 1 0 10-2 0v2a1 1 0 102 0v-2zM27.5 15a1 1 0 011 1v8a1 1 0 11-2 0v-8a1 1 0 011-1zM28.5 8a1 1 0 10-2 0v4a1 1 0 102 0V8zM13.5 7a1 1 0 011 1v8a1 1 0 11-2 0V8a1 1 0 011-1zM14.5 20a1 1 0 10-2 0v4a1 1 0 102 0v-4zM20.5 7a1 1 0 011 1v10a1 1 0 11-2 0V8a1 1 0 011-1zM21.5 22a1 1 0 10-2 0v2a1 1 0 102 0v-2z"
        fill="#000"
      />
    </AccessibleSvg>
  )
}
