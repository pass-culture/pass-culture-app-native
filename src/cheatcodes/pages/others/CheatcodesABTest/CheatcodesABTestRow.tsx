import React from 'react'
import styled from 'styled-components/native'

import { abTestOverridesActions, useOverride } from 'shared/useABSegment/abTestOverrideStore'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'

const AUTO_KEY = 'Par défaut'

const CheatcodesABTestRow = ({
  item,
}: {
  item: {
    id: string
    label: string
    description?: string
    segments: string[]
  }
}) => {
  const forcedSegment = useOverride(item.id)
  const options = [
    { key: AUTO_KEY, label: AUTO_KEY },
    ...item.segments.map((segment) => ({ key: segment, label: segment })),
  ]
  const handleChange = (value: string) => {
    abTestOverridesActions.setOverride(item.id, value === AUTO_KEY ? null : value)
  }

  return (
    <Row>
      <RadioButtonGroup
        label={item.label}
        options={options}
        display="horizontal"
        value={forcedSegment ?? AUTO_KEY}
        onChange={handleChange}
      />
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.m,
}))

export default CheatcodesABTestRow
