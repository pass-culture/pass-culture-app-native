import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { LinkToComponent } from 'features/internal/cheatcodes/components/LinkToComponent'
import { Row } from 'features/internal/cheatcodes/components/Row'
import { AchievementSuccessModal } from 'features/profile/components/Modals/AchievementSuccessModal'
import { AchievementId } from 'features/profile/pages/Achievements/AchievementData'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

export function NavigationAchievements(): React.JSX.Element {
  const { visible, showModal, hideModal } = useModal(false)

  return (
    <ScrollView>
      <CheatcodesHeader title="Achievements 🏆" />
      <StyledContainer>
        <LinkToComponent name="Achievements" />
        <Row half>
          <ButtonPrimary wording="AchievementSuccessModal" onPress={showModal} />
          <AchievementSuccessModal
            id={AchievementId.FIRST_ART_LESSON_BOOKING}
            visible={visible}
            hideModal={hideModal}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})
