import { t } from '@lingui/macro'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { ColorsEnum, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

export const ReinitializeFiltersButton = () => {
  const { dispatch } = useSearch()

  const reinitializeFilters = () => {
    dispatch({ type: 'INIT' })
  }

  return (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={reinitializeFilters}>
      <Typo.ButtonText color={ColorsEnum.WHITE}>{_(t`Réinitialiser`)}</Typo.ButtonText>
    </TouchableOpacity>
  )
}
