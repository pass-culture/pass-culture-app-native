import React, { PropsWithChildren, useState } from 'react'

import { CollapsibleTextContent } from './CollapsibleTextContent/CollapsibleTextContent'

type Props = {
  // Minimum number of lines when collapsible is collapsed.
  numberOfLines: number
} & PropsWithChildren

// TODO(PC-33655): see the possibilities for improving the component
export function CollapsibleText({ numberOfLines, children }: Readonly<Props>) {
  const [expanded, setExpanded] = useState(false)

  const onButtonPress = () => setExpanded((prevExpanded) => !prevExpanded)

  return (
    <CollapsibleTextContent
      expanded={expanded}
      numberOfLines={numberOfLines}
      onButtonPress={onButtonPress}>
      {children}
    </CollapsibleTextContent>
  )
}
