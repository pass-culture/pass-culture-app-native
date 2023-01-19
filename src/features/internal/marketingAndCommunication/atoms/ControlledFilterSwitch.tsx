import React, { useState } from 'react'

import FilterSwitch from 'ui/components/FilterSwitch'

interface Props {
  onChange: (value: boolean) => void
  name: string
}

export const ControlledFilterSwitch = (props: Props) => {
  const [active, setActive] = useState(false)

  return (
    <FilterSwitch
      {...props}
      active={active}
      toggle={() => {
        setActive((prevState) => {
          const newValue = !prevState
          props.onChange(newValue)
          return newValue
        })
      }}
    />
  )
}
