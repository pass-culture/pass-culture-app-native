import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'

interface ProfileBadgeProps {
  message: string
  icon?: FunctionComponent<IconInterface>
  callToActionIcon?: FunctionComponent<IconInterface>
  callToActionMessage?: string
  testID?: string
}

const renderCallToAction = (
  callToActionMessage: string | undefined,
  callToActionIcon: FunctionComponent<IconInterface> | undefined
) => {
  if (!callToActionMessage) {
    return null
  } else {
    return (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={4} />
        <CallToActionContainer>
          <ButtonQuaternaryBlack
            inline
            icon={callToActionIcon}
            testId="call-to-action-button"
            onPress={() => null}
            title={callToActionMessage}
          />
        </CallToActionContainer>
      </React.Fragment>
    )
  }
}

export function ProfileBadge(props: ProfileBadgeProps) {
  const Icon = props.icon

  return (
    <Container testID={props.testID || 'profile-badge'}>
      {Icon ? (
        <IconContainer>
          <Icon size={48} />
        </IconContainer>
      ) : null}
      <TextContainer>
        <Typo.Caption color={props.callToActionMessage ? ColorsEnum.GREY_DARK : ColorsEnum.BLACK}>
          {props.message}
        </Typo.Caption>
        {renderCallToAction(props.callToActionMessage, props.callToActionIcon)}
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: ColorsEnum.GREY_LIGHT,
  borderRadius: 6,
  padding: getSpacing(4),
})

const IconContainer = styled.View({
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})

const CallToActionContainer = styled.View({
  flexDirection: 'row',
})
