import { isEqualWith } from 'lodash'
import React, { FC, useContext, useMemo, useRef, useEffect, ReactElement } from 'react'
import { View } from 'react-native'
import { v4 } from 'uuid'

import { ScrollContext } from 'ui/components/scrollViewWithContext/ScrollContext'

export const StickyElement: FC<{ children: ReactElement }> = ({ children }) => {
  const elementRef = useRef<View>(null)
  const context = useContext(ScrollContext)
  const previousChildrenRef = useRef<ReactElement>(children)

  if (context === undefined) {
    throw new Error(
      'StickyElement must be used within a ScrollViewWithContext, replace the ScrollView by a ScrollViewWithContext'
    )
  }
  const id = useMemo(() => v4(), [])

  useEffect(() => {
    context.registerElement(id, elementRef, <View>{children}</View>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isSameProps(previousChildrenRef.current?.props, children?.props)) {
      context.rerenderElement(id, elementRef, <View>{children}</View>)
      previousChildrenRef.current = children
    }
  }, [children, context, id])

  return <View ref={elementRef}>{children}</View>
}

const isSameProps = (obj1: unknown = {}, obj2: unknown = {}) => {
  return isEqualWith(obj1, obj2, (value1, value2) => {
    if (typeof value1 === 'function' && typeof value2 === 'function') {
      return true
    }
    return undefined
  })
}
