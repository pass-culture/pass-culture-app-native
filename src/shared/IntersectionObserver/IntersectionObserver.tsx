import React, { ReactNode } from 'react'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

type Percent = `${number}%`

interface Props {
  children: ReactNode
  onChange: (inView: boolean) => void
  threshold?: Percent | number
}

/**
 * This component must be used in an IOScrollView or an IOFlatList
 * https://github.com/zhbhun/react-native-intersection-observer#usage
 */
export function IntersectionObserver({ children, onChange, threshold = 0 }: Readonly<Props>) {
  return (
    <Container>
      <StyledInView testID="intersectionObserver" onChange={onChange} threshold={threshold} />
      {children}
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
})

const StyledInView = styled(InView)<{ threshold: Percent | number }>(({ threshold }) => ({
  position: 'absolute',
  bottom: 0,
  top: threshold,
  left: 0,
  right: 0,
}))
