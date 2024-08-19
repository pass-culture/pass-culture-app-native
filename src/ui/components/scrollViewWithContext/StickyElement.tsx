import React, { FC, PropsWithChildren, useContext, useMemo, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { v4 } from 'uuid'

import { ScrollContext } from 'ui/components/scrollViewWithContext/ScrollContext'

export const StickyElement: FC<PropsWithChildren> = ({ children }) => {
  const elementRef = useRef<View>(null)
  const context = useContext(ScrollContext)

  if (context === undefined) {
    throw new Error(
      'StickyElement must be used within a ScrollViewWithContext, replace the ScrollView by a ScrollViewWithContext'
    )
  }
  const id = useMemo(() => v4(), [])

  useEffect(() => {
    context.registerElement(id, elementRef, <View>{children}</View>)
  }, [children, context, id])

  useEffect(() => {
    console.log('children changed')
    // context.rerenderElement(id, <View>{children}</View>)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return <View ref={elementRef}>{children}</View>
}
