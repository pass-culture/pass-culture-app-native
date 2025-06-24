import React from 'react'

import { AccessibilityActionItem } from 'features/profile/components/AccessibilityActionPlanSection/types'
import { BulletListItem } from 'ui/components/BulletListItem'
import { Tag } from 'ui/components/Tag/Tag'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type AccessibilityActionPlanSectionProps = {
  title: string
  items: AccessibilityActionItem[]
}

export function AccessibilityActionPlanSection({
  title,
  items,
}: AccessibilityActionPlanSectionProps) {
  return (
    <ViewGap gap={6}>
      <Typo.Title4 {...getHeadingAttrs(2)}>{title}</Typo.Title4>
      <VerticalUl>
        {items.map((item) => (
          <BulletListItem key={item.id} text={item.text}>
            {item.customContent}
            {SPACE}
            <Tag label={item.tag.label} variant={item.tag.variant} />
          </BulletListItem>
        ))}
      </VerticalUl>
    </ViewGap>
  )
}
