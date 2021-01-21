import { t } from '@lingui/macro'
import React from 'react'

import { CenteredSection } from 'features/search/atoms'
import { _ } from 'libs/i18n'
import { Slider } from 'ui/components/inputs/Slider'

const MAX_RADIUS = 100
const formatKm = (km: number) => `${km} km`

export const Radius: React.FC = () => (
  <CenteredSection title={_(t`Rayon`)}>
    <Slider showValues={true} values={[MAX_RADIUS]} max={MAX_RADIUS} formatValues={formatKm} />
  </CenteredSection>
)
