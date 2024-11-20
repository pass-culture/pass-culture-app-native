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
  const {
    visible: visibleOneAchievement,
    showModal: showModalOneAchievement,
    hideModal: hideModalOneAchievement,
  } = useModal(false)
  const {
    visible: visibleSeveralAchievements,
    showModal: showModalSeveralAchievements,
    hideModal: hideModalSeveralAchievements,
  } = useModal(false)

  return (
    <ScrollView>
      <CheatcodesHeader title="Achievements 🏆" />
      <StyledContainer>
        <LinkToComponent name="Achievements" half={false} />
        <Row>
          <ButtonPrimary
            wording="AchievementSuccessModal (1 unlocked)"
            onPress={showModalOneAchievement}
          />
          {visibleOneAchievement ? (
            <AchievementSuccessModal
              ids={[AchievementId.FIRST_BOOK_BOOKING]}
              visible={visibleOneAchievement}
              hideModal={hideModalOneAchievement}
            />
          ) : null}
        </Row>
        <Row>
          <ButtonPrimary
            wording="AchievementSuccessModal (2+ unlocked)"
            onPress={showModalSeveralAchievements}
          />
          {visibleSeveralAchievements ? (
            <AchievementSuccessModal
              ids={[AchievementId.FIRST_ART_LESSON_BOOKING, AchievementId.FIRST_BOOK_BOOKING]}
              visible={visibleSeveralAchievements}
              hideModal={hideModalSeveralAchievements}
            />
          ) : null}
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
