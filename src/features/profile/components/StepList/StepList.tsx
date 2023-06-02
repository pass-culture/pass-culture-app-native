import React, { ReactElement } from 'react'

import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'

import { InternalStep } from '../InternalStep/InternalStep'
import { StepProps } from '../Step/Step'
import { StepVariant } from '../VerticalStepper/types'

export interface StepListProps {
  activeStepIndex: number
  children: ReactElement<StepProps>[]
}

function getVariantFromIndex(activeStepIndex: number, stepIndex: number) {
  if (activeStepIndex < stepIndex) return StepVariant.future
  if (activeStepIndex === stepIndex) return StepVariant.in_progress
  return StepVariant.complete
}

/**
 * Create a step list that automatically assigns correct `StepVariant` based on
 * `activeStepIndex` value.
 *
 * @example
 * <StepList activeStepIndex={0}>
 *   <Step>
 *     <MyWonderfulComponent />
 *   </Step>
 *   <Step>
 *     <AnotherComponent />
 *   </Step>
 *   <Step>
 *     <FinalComponent />
 *   </Step>
 * </StepList>
 */
export function StepList({ activeStepIndex, children, ...props }: StepListProps) {
  if (activeStepIndex > children.length - 1) {
    console.warn(
      `[StepList] - Given (\`activeStepIndex\`: ${activeStepIndex}) but children length is ${
        children.length
      }. Maximum \`activeStepIndex\` should be ${children.length - 1}.`
    )
  }

  return (
    <VerticalUl {...props}>
      {React.Children.map(children, (child, index) => {
        return (
          <Li>
            <InternalStep
              variant={getVariantFromIndex(activeStepIndex, index)}
              isFirst={index === 0}
              isLast={index === children.length - 1}
              {...child.props}
            />
          </Li>
        )
      })}
    </VerticalUl>
  )
}
