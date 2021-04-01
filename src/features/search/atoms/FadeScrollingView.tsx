import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

export const useDebouncedScrolling = () => {
  const [isScrolling, setIsScrolling] = useState(false)
  let timeoutID: NodeJS.Timeout
  const handleIsScrollingFactory = useCallback(
    (scrolling: boolean) => () => {
      if (scrolling) {
        if (timeoutID) clearTimeout(timeoutID)
        setIsScrolling(true)
      } else {
        timeoutID = setTimeout(() => setIsScrolling(false), 500)
      }
    },
    []
  )
  return { isScrolling, handleIsScrollingFactory }
}

export const FadeScrollingView: React.FC<{ children: Element; isScrolling: boolean }> = ({
  children,
  isScrolling,
}) => {
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [visible, setVisible] = useState<boolean>(!isScrolling)
  const fadeAnim = useRef(new Animated.Value(+isFirstRender)).current

  useEffect(() => setIsFirstRender(false), [])

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: +visible,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setVisible(!visible))
  }, [isScrolling])

  return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>
}
