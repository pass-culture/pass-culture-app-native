import React from 'react'
import styled from 'styled-components/native'

import { AttachedCardDisplay } from 'features/home/components/AttachedModuleCard/AttachedCardDisplay'
import { getHighlightAccessibilityLabel } from 'features/home/helpers/getHighlightAccessibilityLabel'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

type Props = {
  title: string
  subtitle?: string
  label?: string
  shouldFixHeight?: boolean
}

export const AttachedThematicCard = ({ title, subtitle, label, shouldFixHeight }: Props) => {
  const details = subtitle ? [subtitle] : undefined

  const accessibilityLabel = getHighlightAccessibilityLabel({
    title,
    subtitle,
    label,
  })

  return (
    <AttachedCardDisplay
      title={title}
      subtitle={label}
      details={details}
      accessibilityLabel={accessibilityLabel}
      bottomRightElement={<ArrowRightIcon />}
      shouldFixHeight={shouldFixHeight}
    />
  )
}

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})
