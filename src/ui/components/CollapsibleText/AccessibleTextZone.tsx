import React, { Ref } from 'react'
import { AccessibilityActionEvent, View } from 'react-native'
import styled from 'styled-components/native'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { normalizeURL } from 'libs/parsers/highlightLinks'
import { ZoneLayout } from 'ui/components/CollapsibleText/helpers/getAccessibleZonesLayout'
import { getTextLinks } from 'ui/components/CollapsibleText/helpers/getTextLinks'

type Props = {
  text: string
  layout?: ZoneLayout
  ref?: Ref<View>
}

const FULL_HEIGHT_LAYOUT = { top: 0, bottom: 0 }

export function AccessibleTextZone({ text, layout, ref }: Props) {
  const links = getTextLinks(text)
  const accessibilityActions = links.map((link, index) => ({
    name: `openLink${index}`,
    label: `Ouvrir le lien ${link}`,
  }))

  const onAccessibilityAction = ({ nativeEvent }: AccessibilityActionEvent) => {
    const actionIndex = accessibilityActions.findIndex(
      ({ name }) => name === nativeEvent.actionName
    )
    const link = links[actionIndex]
    if (link) void openUrl(normalizeURL(link), undefined, true)
  }

  return (
    <Zone
      ref={ref}
      accessible
      accessibilityRole="text"
      accessibilityLabel={text}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      onAccessibilityTap={() => undefined}
      pointerEvents="box-none"
      style={layout ?? FULL_HEIGHT_LAYOUT}
    />
  )
}

const Zone = styled(View)({
  position: 'absolute',
  left: 0,
  right: 0,
})
