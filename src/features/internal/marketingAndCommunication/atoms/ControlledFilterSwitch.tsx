import React, { useCallback, useState } from 'react'

import FilterSwitch from 'ui/components/FilterSwitch'

interface Props {
  onChange: (value: boolean) => void
  name: string
}

export const ControlledFilterSwitch = (props: Props) => {
  const [active, setActive] = useState(false)

  const toggleActive = useCallback(() => {
    setActive((prevState) => {
      const newValue = !prevState
      props.onChange(newValue)
      return newValue
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onChange])

  return <FilterSwitch {...props} active={active} toggle={toggleActive} />
}
