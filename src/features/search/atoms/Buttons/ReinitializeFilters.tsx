import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useCallbackOnce } from 'features/offer/services/useCallbackOnce'
import { useSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
import { ColorsEnum, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const ReinitializeFilters = () => {
  const { dispatch } = useSearch()
  const { callbackOnce: logReinitializeFilters } = useCallbackOnce(() => {
    analytics.logReinitializeFilters()
  })
  const reinitializeFilters = () => {
    dispatch({ type: 'INIT' })
    dispatch({ type: 'SHOW_RESULTS', payload: true })
    logReinitializeFilters()
  }

  return (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={reinitializeFilters}>
      <Typo.ButtonText color={ColorsEnum.WHITE}>{_(t`Réinitialiser`)}</Typo.ButtonText>
    </TouchableOpacity>
  )
}
