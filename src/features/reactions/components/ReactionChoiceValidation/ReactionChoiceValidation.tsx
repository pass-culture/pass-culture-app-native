import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ReactionTypeEnum } from 'api/gen'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ThumbDownFilled } from 'ui/svg/icons/ThumbDownFilled'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'

type Props = {
  handleOnPressReactionButton: (reactionType: ReactionTypeEnum) => void
  reactionStatus?: ReactionTypeEnum | null
  likeLabel: string
  dislikeLabel: string
}

export const ReactionChoiceValidation: FunctionComponent<Props> = ({
  reactionStatus,
  handleOnPressReactionButton,
  likeLabel,
  dislikeLabel,
  ...props
}) => {
  return (
    <ButtonsContainer gap={4} {...props}>
      <ButtonContainer>
        <Button
          wording={likeLabel}
          icon={ThumbUpFilled}
          onPress={() => handleOnPressReactionButton(ReactionTypeEnum.LIKE)}
          variant="secondary"
          color={reactionStatus === ReactionTypeEnum.LIKE ? 'brand' : 'neutral'}
          size="small"
        />
      </ButtonContainer>
      <ButtonContainer>
        <Button
          wording={dislikeLabel}
          icon={ThumbDownFilled}
          onPress={() => handleOnPressReactionButton(ReactionTypeEnum.DISLIKE)}
          variant="secondary"
          color={reactionStatus === ReactionTypeEnum.DISLIKE ? 'brand' : 'neutral'}
          size="small"
        />
      </ButtonContainer>
    </ButtonsContainer>
  )
}

const ButtonsContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const ButtonContainer = styled.View({
  flex: 1,
})
