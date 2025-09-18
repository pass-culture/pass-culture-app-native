import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { CheckboxGroupProps } from 'ui/designSystem/CheckboxGroup/types'
import { Typo } from 'ui/theme'

export const CheckboxGroup = ({
  label,
  labelTag = 'span',
  description,
  error,
  options,
  value,
  onChange,
  display = 'vertical',
  variant = 'default',
  disabled = false,
}: CheckboxGroupProps) => {
  console.log({
    description,
    error,
    options,
    value,
    onChange,
    display,
    variant,
    disabled,
  })

  // TODO(PC-37011): Améliore la logique de LabelTag
  const LabelTag =
    labelTag === 'h1'
      ? Typo.Title1
      : labelTag === 'h2'
        ? Typo.Title2
        : labelTag === 'h3'
          ? Typo.Title3
          : Typo.BodyAccent

  return (
    <Container accessibilityRole={AccessibilityRole.GROUP}>
      <Header>
        <LabelTag>{label}</LabelTag>
        {description ? <Description>{description}</Description> : null}
      </Header>
    </Container>
  )
}

const Container = styled.View({})
const Header = styled.View({})
const Description = styled(Typo.Body)({})
