import { isEqual } from 'lodash'
import React, { useRef, useState } from 'react'
import { Text, TextLayoutEvent, View } from 'react-native'

import { AccessibleTextZone } from 'ui/components/CollapsibleText/AccessibleTextZone'
import {
  AccessibleZonesLayout,
  getAccessibleZonesLayout,
} from 'ui/components/CollapsibleText/helpers/getAccessibleZonesLayout'
import { getPlainText } from 'ui/components/CollapsibleText/helpers/getPlainText'
import { getRenderedText } from 'ui/components/CollapsibleText/helpers/getRenderedText'
import { ExpandedTextProps } from 'ui/components/CollapsibleText/types'
import { useFocusOnMount } from 'ui/components/CollapsibleText/useFocusOnMount'
import { Markdown } from 'ui/components/Markdown/Markdown'

export function ExpandedText({ firstPart, secondPart }: ExpandedTextProps) {
  const continuationRef = useRef<View>(null)
  const [zonesLayout, setZonesLayout] = useState<AccessibleZonesLayout>()
  useFocusOnMount(continuationRef)

  const firstPartPlainText = getPlainText(firstPart)
  const secondPartPlainText = getPlainText(secondPart)
  const firstPartRenderedLength = getRenderedText(firstPart).length

  const onTextLayout = ({ nativeEvent }: TextLayoutEvent) => {
    const newZonesLayout = getAccessibleZonesLayout(nativeEvent.lines, firstPartRenderedLength)
    setZonesLayout((previous) => (isEqual(previous, newZonesLayout) ? previous : newZonesLayout))
  }

  return (
    <View>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Text onTextLayout={onTextLayout}>
          <Markdown>{firstPart}</Markdown>
          <Markdown>{secondPart}</Markdown>
        </Text>
      </View>
      <AccessibleTextZone text={firstPartPlainText.trim()} layout={zonesLayout?.firstZone} />
      <AccessibleTextZone
        ref={continuationRef}
        text={secondPartPlainText.trim()}
        layout={zonesLayout?.secondZone}
      />
    </View>
  )
}
