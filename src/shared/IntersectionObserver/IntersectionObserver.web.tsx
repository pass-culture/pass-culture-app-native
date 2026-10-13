import React, { FC } from 'react'
import { InView } from 'react-intersection-observer'
import styled from 'styled-components'

import { IntersectionObserverProps } from './types'

export const IntersectionObserver: FC<IntersectionObserverProps> = ({ fill, ...props }) => (
  <StyledInView $fill={fill} {...props} />
)

const StyledInView = styled(InView)<{ $fill?: boolean }>(({ $fill }) => ({
  width: '100%',
  minWidth: 0,
  ...($fill
    ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
    : null),
}))
