import { t } from '@lingui/macro'
import React from 'react'

import { CenteredSection } from 'features/search/atoms'
import { _ } from 'libs/i18n'
import { Slider } from 'ui/components/inputs/Slider'

const MAX_PRICE = 300
const formatEuro = (price: number) => `${price} €`

export const PriceSlider: React.FC = () => (
  <CenteredSection title={_(t`Prix`)}>
    <Slider showValues={true} values={[0, MAX_PRICE]} max={MAX_PRICE} formatValues={formatEuro} />
  </CenteredSection>
)
