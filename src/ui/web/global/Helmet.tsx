import React from 'react'

import { Helmet as ReactHelmet } from 'libs/react-helmet/Helmet'

export const Helmet = ({ title }: { title: string }) => (
  <ReactHelmet>
    <title>{title}</title>
  </ReactHelmet>
)
