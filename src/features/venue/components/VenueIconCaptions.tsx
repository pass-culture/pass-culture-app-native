import React from 'react'
import styled from 'styled-components/native'

import { VenueTypeCode } from 'api/gen'
import { Spacer } from 'ui/theme'

import { VenueType } from '../atoms/VenueType'

type Props = { type: VenueTypeCode | null | undefined; label: string }

export const VenueIconCaptions: React.FC<Props> = ({ type, label }) => {
  return (
    <Row>
      <Spacer.Row numberOfSpaces={6} />
      <VenueType type={type} label={label} />
      <Spacer.Row numberOfSpaces={6} />
    </Row>
  )
}

const Row = styled.View({ flexDirection: 'row', alignItems: 'flex-start' })
