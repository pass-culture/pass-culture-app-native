import React from 'react'
import styled from 'styled-components/native'

import {
  PageHeaderWithoutPlaceholder,
  useGetHeaderHeight,
} from 'ui/components/headers/PageHeaderWithoutPlaceholder'

interface Props {
  title: string
}

export const CheatcodesHeader = ({ title }: Props) => {
  const headerHeight = useGetHeaderHeight()
  return (
    <React.Fragment>
      <PageHeaderWithoutPlaceholder title={title} />
      <Placeholder height={headerHeight} />
    </React.Fragment>
  )
}

const Placeholder = styled.View<{ height: number }>(({ height }) => ({
  height,
  backgroundColor: 'white',
}))
