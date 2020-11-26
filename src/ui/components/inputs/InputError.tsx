import { t } from '@lingui/macro'
import React, { FC, Fragment } from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  messageId: string
  visible: boolean
  numberOfSpacesTop: number
}

export const InputError: FC<Props> = (props) => {
  return props.visible ? (
    <Fragment>
      <Spacer.Column testID="input-error-top-spacer" numberOfSpaces={props.numberOfSpacesTop} />
      <StyledInline>
        <Warning size={24} />
        <Spacer.Row numberOfSpaces={1} />
        <Typo.Caption color={ColorsEnum.ERROR}>{_(t`${props.messageId}`)}</Typo.Caption>
      </StyledInline>
    </Fragment>
  ) : null
}

const StyledInline = styled.View({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  maxWidth: getSpacing(125),
})
