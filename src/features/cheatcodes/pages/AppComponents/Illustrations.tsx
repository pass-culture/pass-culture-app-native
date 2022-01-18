import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'

import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { EmptyFavoritesDeprecated } from 'ui/svg/icons/EmptyFavorites_deprecated'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { HappyFaceDeprecated } from 'ui/svg/icons/HappyFace_deprecated'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { NoBookingsDeprecated } from 'ui/svg/icons/NoBookings_deprecated'
import { SadFace } from 'ui/svg/icons/SadFace'
import { SadFaceDeprecated } from 'ui/svg/icons/SadFace_deprecated'
import { IconInterface } from 'ui/svg/icons/types'
import { PhoneError } from 'ui/svg/PhoneError'
import { ColorsEnum } from 'ui/theme'

export const Illustrations: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Text>{'Illustration icons should have a standard size of 140'}</Text>
      <Illustration name="BicolorPhonePending" component={BicolorPhonePending} isNew />
      <Illustration name="BrokenConnection" component={BrokenConnection} isNew />
      <Illustration name="ErrorIllustration" component={ErrorIllustration} isNew />
      <Illustration name="EmptyFavoritesDeprecated" component={EmptyFavoritesDeprecated} />
      <Illustration name="EmptyFavorites" component={EmptyFavorites} isNew />
      <Illustration name="HappyFaceDeprecated" component={HappyFaceDeprecated} />
      <Illustration name="HappyFace" component={HappyFace} isNew />
      <Illustration name="NoBookingsDeprecated" component={NoBookingsDeprecated} />
      <Illustration name="NoBookings" component={NoBookings} isNew />
      <Illustration name="PhoneError" component={PhoneError} isNew />
      <Illustration name="SadFaceDeprecated" component={SadFaceDeprecated} />
      <Illustration name="SadFace" component={SadFace} isNew />
    </React.Fragment>
  )
}

interface IllustrationsProps {
  name: string
  component: React.ComponentType<IconInterface>
  isNew?: boolean
}

const Illustration = ({ name, component: IconComponent, isNew = false }: IllustrationsProps) => (
  <AlignedText>
    <IconComponent />
    <Text style={{ color: isNew ? ColorsEnum.BLACK : ColorsEnum.GREY_DARK }}>
      {` - ${name} ${isNew ? '' : '(deprecated)'}`}
    </Text>
  </AlignedText>
)
const AlignedText = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
})
