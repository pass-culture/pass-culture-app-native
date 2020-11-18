import whyDidYouRender from '@welldone-software/why-did-you-render'
import React from 'react'

import { env } from 'libs/environment'

if (env.ENABLE_WHY_DID_YOU_RENDER) {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    titleColor: 'white',
    diffNameColor: 'red',
  })
}
