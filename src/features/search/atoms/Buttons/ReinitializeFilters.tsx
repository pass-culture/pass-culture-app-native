import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { accessibilityAndTestId } from 'tests/utils'
import { ColorsEnum, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const ReinitializeFilters = () => {
  const { dispatch } = useStagedSearch()
  const logReinitializeFilters = useFunctionOnce(() => {
    analytics.logReinitializeFilters()
  })

  const reinitializeFilters = () => {
    dispatch({ type: 'INIT' })
    logReinitializeFilters()
  }

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      onPress={reinitializeFilters}
      {...accessibilityAndTestId(t`Réinitialiser les filtres`)}>
      <Typo.ButtonText color={ColorsEnum.WHITE}>{t`Réinitialiser`}</Typo.ButtonText>
    </TouchableOpacity>
  )
}
