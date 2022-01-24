import React, { useEffect, useState, memo } from 'react'
import styled from 'styled-components/native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { ProgressBarProps } from './ProgressBar.types'

const STEP = 1
const MAX_NB_OF_STEPS = 100
const NB_OF_STEPS = MAX_NB_OF_STEPS / STEP

const NotMemoizedProgressBar = (props: ProgressBarProps) => {
  const [step, setStep] = useState(0)

  const intervalDuration = props.timeout / NB_OF_STEPS
  useEffect(() => {
    setStep(0)
    const interval = setInterval(() => {
      setStep((previousStep) => {
        const nextStep = previousStep + STEP
        if (nextStep >= MAX_NB_OF_STEPS) {
          clearInterval(interval)
        }
        return nextStep
      })
    }, intervalDuration)
    return () => {
      clearInterval(interval)
    }
  }, [intervalDuration, props.refresher])

  return <StyledView color={props.color} width={step} duration={intervalDuration} />
}

export const ProgressBar = memo(NotMemoizedProgressBar)

const StyledView = styled.View<{
  width: number
  color: ColorsEnum
  duration: number
}>((props) => ({
  width: `${props.width}%`,
  height: '10px',
  backgroundColor: props.color,
  transition: `width ${props.duration}ms linear`,
}))
