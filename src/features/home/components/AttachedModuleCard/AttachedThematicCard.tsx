import React from 'react'
import styled from 'styled-components/native'

import { AttachedCardDisplay } from 'features/home/components/AttachedModuleCard/AttachedCardDisplay'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'

type Props = {
  title: string
  subtitle?: string
  label?: string
}

export const AttachedThematicCard = ({ title, subtitle, label }: Props) => {
  const details = subtitle ? [subtitle] : undefined

  return (
    <AttachedCardDisplay
      title={title}
      subtitle={label}
      details={details}
      bottomRightElement={<ArrowRightIcon />}
    />
  )
}

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})
