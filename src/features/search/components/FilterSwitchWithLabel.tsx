import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  isActive: boolean
  toggle: () => void
  label: string
  testID?: string
}

export const FilterSwitchWithLabel: FunctionComponent<Props> = ({
  isActive,
  toggle,
  label,
  testID,
}) => {
  const checkboxID = useMemo(uuidv4, [])
  const labelID = useMemo(uuidv4, [])
  const describedByID = useMemo(uuidv4, [])
  const { isDesktopViewport } = useTheme()

  return (
    <Container inverseLayout={!!isDesktopViewport}>
      {!isDesktopViewport && (
        <InputLabel htmlFor={checkboxID}>
          <Typo.ButtonText>{label}</Typo.ButtonText>
        </InputLabel>
      )}
      <FilterSwitch
        checkboxID={checkboxID}
        active={isActive}
        toggle={toggle}
        accessibilityLabelledBy={labelID}
        accessibilityDescribedBy={describedByID}
        testID={testID}
      />
      {!!isDesktopViewport && (
        <React.Fragment>
          <Spacer.Row numberOfSpaces={2} testID="inverseLayout" />
          <InputLabel htmlFor={checkboxID}>
            <Typo.ButtonText>{label}</Typo.ButtonText>
          </InputLabel>
        </React.Fragment>
      )}
    </Container>
  )
}

const Container = styled.View<{ inverseLayout?: boolean }>(({ inverseLayout }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  ...(!inverseLayout && { justifyContent: 'space-between' }),
}))
