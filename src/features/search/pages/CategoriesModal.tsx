import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Categories } from 'features/search/pages/Categories'
import { AppModal } from 'ui/components/modals/AppModal'
import { Close } from 'ui/svg/icons/Close'

interface Props {
  visible: boolean
  dismissModal: () => void
}

const MODAL_HEIGHT_RATIO = 3 / 4

export const CategoriesModal: FunctionComponent<Props> = ({ visible, dismissModal }) => {
  const { height: windowHeight } = useWindowDimensions()
  return (
    <AppModal
      animationOutTiming={1}
      visible={visible}
      title="Catégories"
      leftIconAccessibilityLabel={undefined}
      leftIcon={undefined}
      onLeftIconPress={undefined}
      rightIconAccessibilityLabel={'Ne pas filtrer sur les catégories et retourner aux résultats'}
      rightIcon={Close}
      onRightIconPress={dismissModal}>
      <ModalContent windowHeight={windowHeight} testID="categoriesModal">
        <Categories dismissModal={dismissModal} />
      </ModalContent>
    </AppModal>
  )
}

const ModalContent = styled.View<{ windowHeight: number }>(({ windowHeight }) => ({
  width: '100%',
  minHeight: windowHeight * MODAL_HEIGHT_RATIO,
}))
