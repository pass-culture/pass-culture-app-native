import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { plural } from 'libs/plural'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'

export const HiddenAccessibleResultNumber = ({
  nbResults,
  show,
}: {
  nbResults: number
  show: boolean
}) => {
  const numberOfResults = plural(nbResults, {
    singular: '# résultat',
    plural: '# résultats',
  })

  return (
    <HiddenAccessibleText accessibilityRole={AccessibilityRole.STATUS}>
      {show ? numberOfResults : ''}
    </HiddenAccessibleText>
  )
}
