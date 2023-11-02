import React, { ReactNode } from 'react'
import { InView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

type Percent = `${number}%`

interface Props {
  children: ReactNode
  onChange: (inView: boolean) => void
  /**
   * You can define a threshold before `onChange` is triggered.
   * If `threshold` is a number, it will be triggered when `X` pixels are visible.
   * If `threshold` is a percent, it will be triggered when `X` percents of element are visible.
   * @example With percent
   * <IntersectionObserver threshold="10%" />
   *
   * @example With fix number
   * <IntersectionObserver threshold={20} />
   */
  threshold?: Percent | number
}

/**
 * This component must be used in an IOScrollView or an IOFlatList
 * https://github.com/zhbhun/react-native-intersection-observer#usage
 * This component is a hack because the lib doesn't purpose the possibility of adding a threshold for the moment
 * An issue is open here : https://github.com/zhbhun/react-native-intersection-observer/issues/14
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
