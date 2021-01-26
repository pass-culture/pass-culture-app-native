import { t } from '@lingui/macro'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

const RightIcon: React.FC<{ value: string; onPress: () => void }> = (props) =>
  props.value.length > 0 ? (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={props.onPress}>
      <Invalidate size={24} />
    </TouchableOpacity>
  ) : null

export const LocationPicker: React.FC = () => {
  const [value, setValue] = useState<string>('')

  const resetSearch = () => {
    setValue('')
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={14} />
      <StyledInput>
        <Spacer.Column numberOfSpaces={4} />
        <SearchInput
          value={value}
          onChangeText={setValue}
          placeholder={_(t`Choisir un lieu...`)}
          autoFocus={true}
          inputHeight="tall"
          RightIcon={() => <RightIcon value={value} onPress={resetSearch} />}
        />
      </StyledInput>
      <PageHeader title={_(t`Choisir un lieu`)} />
    </React.Fragment>
  )
}

const StyledInput = styled.View({ width: '100%', marginHorizontal: getSpacing(6) })
