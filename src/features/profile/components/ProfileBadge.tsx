import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { handleCallToActionLink } from 'features/profile/utils'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo, Spacer } from 'ui/theme'

interface ProfileBadgeProps {
  message: string
  popOverIcon?: FunctionComponent<IconInterface>
  callToActionIcon?: FunctionComponent<IconInterface> | null
  callToActionMessage?: string | null
  callToActionLink?: string | null
  testID?: string
}

const renderCallToAction = (
  callToActionMessage?: string | null,
  callToActionLink?: string | null,
  callToActionIcon?: FunctionComponent<IconInterface> | null
) => {
  if (!callToActionMessage || !callToActionLink) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      {/* TODO (LucasBeneston) : Add new button with numberOfLines={2} to ui/components/buttons */}
      <ButtonQuaternaryBlack
        inline
        icon={callToActionIcon || undefined}
        testId="call-to-action-button"
        onPress={() => handleCallToActionLink(callToActionLink)}
        title={callToActionMessage}
        justifyContent="flex-start"
      />
    </React.Fragment>
  )
}

export function ProfileBadge(props: ProfileBadgeProps) {
  const Icon = props.popOverIcon

  return (
    <Container testID={props.testID || 'profile-badge'}>
      {Icon ? (
        <IconContainer>
          <Icon size={getSpacing(8)} color={ColorsEnum.GREY_DARK} />
        </IconContainer>
      ) : null}
      <TextContainer>
        <Typo.Caption
          color={
            props.callToActionMessage && props.callToActionLink
              ? ColorsEnum.GREY_DARK
              : ColorsEnum.BLACK
          }>
          {props.message}
        </Typo.Caption>
        {renderCallToAction(
          props.callToActionMessage,
          props.callToActionLink,
          props.callToActionIcon
        )}
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
