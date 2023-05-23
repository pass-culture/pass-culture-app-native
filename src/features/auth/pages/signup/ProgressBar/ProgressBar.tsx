import React, { useRef } from 'react'
import styled from 'styled-components/native'

import { AnimatedView, AnimatedViewRefType } from 'libs/react-native-animatable'
import { Rectangle } from 'ui/svg/Rectangle'
import { getSpacing } from 'ui/theme'

interface Props {
  currentStep: number
  totalStep: number
}

export const ProgressBar = ({ currentStep, totalStep }: Props) => {
  const barRef = useRef<AnimatedViewRefType>(null)
  const progressionRatio = (currentStep / totalStep) * 100

  return (
    <React.Fragment>
      <BarBackground>
        <BarColorContainer
          transition="width"
          width={progressionRatio}
          isFull={currentStep === totalStep}
          duration={800}
          accessibilityLabel={`Étape ${currentStep} sur ${totalStep}`}
          ref={barRef}>
          <BarColor />
        </BarColorContainer>
      </BarBackground>
    </React.Fragment>
  )
}

const BarBackground = styled.View(({ theme }) => ({
  width: '100%',
  height: getSpacing(1.5),
  backgroundColor: theme.colors.greyLight,
  justifyContent: 'flex-start',
}))

const BarColorContainer = styled(AnimatedView)<{ width: number; isFull?: boolean }>(
  ({ width, isFull }) => ({
    borderBottomRightRadius: isFull ? 0 : 3,
    borderTopRightRadius: isFull ? 0 : 3,
    overflow: 'hidden',
    height: '100%',
    width: `${width}%`,
  })
)

const BarColor = styled(Rectangle).attrs({
  size: '100%',
})``
