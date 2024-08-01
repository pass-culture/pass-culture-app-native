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
  const Element = () => <View ref={elementRef}>{children}</View>

  useEffect(() => {
    context.registerElement(id, elementRef, <Element />)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return <Element key={id} />
}
