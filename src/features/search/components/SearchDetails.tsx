import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Clock } from 'ui/svg/icons/Clock'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const SearchDetails: React.FC = () => {
  const { top } = useCustomSafeInsets()
  const [query, setQuery] = useState<string>('')
  const { navigate } = useNavigation<UseNavigationType>()
  const refSearchInput = useRef<TextInput | null>(null)

  const resetSearchInput = () => {
    setQuery('')
    refSearchInput.current?.focus()
  }

  return (
    <React.Fragment>
      <HeaderBackgroundWrapper maxHeight={top}>
        <HeaderBackground />
      </HeaderBackgroundWrapper>
      <SearchInputContainer>
        <TouchableOpacity
          testID="previousBtn"
          onPress={() => navigate(...getTabNavConfig('Search'))}>
          <ArrowPrevious />
        </TouchableOpacity>
        <StyledSearchInputContainer>
          <StyledSearchInput
            value={query}
            onChangeText={setQuery}
            placeholder={t`Offre, artiste...`}
            autoFocus={true}
            inputHeight="regular"
            LeftIcon={() => <MagnifyingGlassIcon />}
            onPressRightIcon={resetSearchInput}
            ref={refSearchInput}
          />
        </StyledSearchInputContainer>
      </SearchInputContainer>

      <RecentSearchContainer>
        <ClockIcon />
        <StyledCaption>{t`Recherche récente`}</StyledCaption>
      </RecentSearchContainer>
    </React.Fragment>
  )
}

const SearchInputContainer = styled.View({
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledSearchInputContainer = styled.View({
  flexDirection: 'row',
  flexGrow: 1,
  marginHorizontal: getSpacing(4),
})

const RecentSearchContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  paddingHorizontal: getSpacing(6),
  minHeight: getSpacing(9),
  flexDirection: 'row',
  alignItems: 'center',
}))

const ClockIcon = styled(Clock).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const StyledCaption = styled(Typo.Caption)({
  marginLeft: getSpacing(3),
})

const StyledSearchInput = styled(SearchInput).attrs(({ theme }) => ({
  focusOutlineColor: theme.colors.black,
}))({
  paddingHorizontal: getSpacing(4),
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const HeaderBackgroundWrapper = styled.View<{ maxHeight: number }>(({ maxHeight }) => ({
  overflow: 'hidden',
  position: 'relative',
  maxHeight,
}))
