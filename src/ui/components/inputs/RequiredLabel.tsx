import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export const RequiredLabel = () => <Label>{t`Obligatoire`}</Label>

const Label = styled(Typo.Caption)(({ theme, color }) => ({
  color: color ?? theme.colors.greyDark,
}))
