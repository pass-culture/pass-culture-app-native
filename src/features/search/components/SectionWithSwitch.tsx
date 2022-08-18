import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { InlineSection, TitleWithCount } from 'features/search/atoms'
import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Spacer } from 'ui/theme'

interface Props {
  active?: boolean
  title: string
  subtitle?: string
  toggle?: () => void
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { title, subtitle, active = false, toggle = () => null } = props
  const checkboxID = uuidv4()
  const labelID = uuidv4()
  const subtitleID = subtitle && uuidv4()

  return (
    <InlineSection
      title={
        <InputLabel id={labelID} htmlFor={checkboxID}>
          <TitleWithCount title={title} count={+active} />
        </InputLabel>
      }
      subtitle={subtitle}
      subtitleID={subtitleID}>
      <Spacer.Row numberOfSpaces={5} />
      <FilterSwitch
        checkboxID={checkboxID}
        active={active}
        toggle={toggle}
        accessibilityLabelledBy={labelID}
        accessibilityDescribedBy={subtitleID}
      />
    </InlineSection>
  )
}
