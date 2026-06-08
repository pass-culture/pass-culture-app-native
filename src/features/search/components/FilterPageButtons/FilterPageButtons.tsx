import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FilterBehaviour } from 'features/search/enums'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { StickyBottomGradient } from 'ui/components/StickyBottomGradient/StickyBottomGradient'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Again } from 'ui/svg/icons/Again'

type Props = {
  onResetPress: () => void
  onSearchPress: () => void
  filterBehaviour: FilterBehaviour
  isModal?: boolean
  isSearchDisabled?: boolean
  children?: never
  isResetDisabled?: boolean
  displayGradient?: boolean
}

export const FilterPageButtons: FunctionComponent<Props> = ({
  isModal = false,
  onResetPress,
  onSearchPress,
  filterBehaviour,
  isSearchDisabled,
  isResetDisabled,
  displayGradient,
}) => {
  let searchButtonText = ''
  switch (filterBehaviour) {
    case FilterBehaviour.SEARCH: {
      searchButtonText = 'Rechercher'
      break
    }
    case FilterBehaviour.APPLY_WITHOUT_SEARCHING: {
      searchButtonText = 'Appliquer le filtre'
      break
    }
  }

  const isZoomed = useMobileFontScaleToDisplay({ default: false, at200PercentZoom: true })

  return (
    <Wrapper>
      {displayGradient ? <StickyBottomGradient /> : null}
      <Container isModal={isModal} gap={4} isZoomed={isZoomed}>
        <ResetButtonWrapper>
          <Button
            wording="Réinitialiser"
            icon={Again}
            onPress={onResetPress}
            disabled={isResetDisabled}
            variant="tertiary"
            color="neutral"
            size="small"
          />
        </ResetButtonWrapper>
        <SearchButtonWrapper isZoomed={isZoomed}>
          <Button
            wording={searchButtonText}
            onPress={onSearchPress}
            disabled={isSearchDisabled}
            color="brand"
            fullWidth={!isZoomed}
          />
        </SearchButtonWrapper>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.View({
  position: 'relative',
})

const Container = styled(ViewGap)<{ isModal: boolean; isZoomed: boolean }>(({
  isModal,
  isZoomed,
  theme,
}) => {
  return {
    flexDirection: isZoomed ? 'column' : 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: theme.designSystem.color.background.default,
    paddingHorizontal: theme.modal.spacing.MD,
    paddingTop: theme.designSystem.size.spacing.s,
    ...(isModal ? {} : { paddingBottom: theme.modal.spacing.MD }),
  }
})

const ResetButtonWrapper = styled.View({
  width: 'auto',
  flexShrink: 0,
})

const SearchButtonWrapper = styled.View<{ isZoomed: boolean }>(({ isZoomed }) => ({
  ...(isZoomed
    ? {
        width: 'auto',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 'auto',
      }
    : {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
      }),
}))
