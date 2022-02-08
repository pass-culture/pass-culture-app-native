import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { InlineSection, TitleWithCount } from 'features/search/atoms'
import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel'

interface Props {
  active?: boolean
  accessibilityLabel: string
  title: string
  subtitle?: string
  toggle?: () => void
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { title, accessibilityLabel, subtitle, active = false, toggle = () => null } = props
  const checkboxID = uuidv4()
  return (
    <InlineSection
      title={
        <InputLabel htmlFor={checkboxID}>
          <TitleWithCount title={title} count={+active} />
        </InputLabel>
      }
      subtitle={subtitle}>
      <FilterSwitch
        checkboxID={checkboxID}
        active={active}
        toggle={toggle}
        accessibilityLabel={accessibilityLabel}
      />
    </InlineSection>
  )
}
