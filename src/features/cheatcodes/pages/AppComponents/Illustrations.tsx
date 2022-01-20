import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'

import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { BicolorIdCardWithMagnifyingGlass } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass'
import { BicolorIdCardWithMagnifyingGlassDeprecated } from 'ui/svg/icons/BicolorIdCardWithMagnifyingGlass_deprecated'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { EmptyFavoritesDeprecated } from 'ui/svg/icons/EmptyFavorites_deprecated'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'
import { HappyFace } from 'ui/svg/icons/HappyFace'
import { HappyFaceDeprecated } from 'ui/svg/icons/HappyFace_deprecated'
import { MaintenanceConeDeprecated } from 'ui/svg/icons/MaintenanceCone_deprecated'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { NoBookingsDeprecated } from 'ui/svg/icons/NoBookings_deprecated'
import { SadFace } from 'ui/svg/icons/SadFace'
import { SadFaceDeprecated } from 'ui/svg/icons/SadFace_deprecated'
import { TicketBooked } from 'ui/svg/icons/TicketBooked'
import { TicketBookedDeprecated } from 'ui/svg/icons/TicketBooked_deprecated'
import { IconInterface } from 'ui/svg/icons/types'
import { PhoneError } from 'ui/svg/PhoneError'
import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

export const Illustrations: FunctionComponent = () => {
  return (
    <React.Fragment>
      <Text>{'Illustration icons should have a standard size of 140'}</Text>
      <Illustration name="BicolorPhonePending" component={BicolorPhonePending} isNew />
      <Illustration
        name="BicolorIdCardWithMagnifyingGlassDeprecated"
        component={BicolorIdCardWithMagnifyingGlassDeprecated}
      />
      <Illustration
        name="BicolorIdCardWithMagnifyingGlass"
        component={BicolorIdCardWithMagnifyingGlass}
        isNew
      />
      <Illustration name="BrokenConnection" component={BrokenConnection} isNew />
      <Illustration name="ErrorIllustration" component={ErrorIllustration} isNew />
      <AlignedText>
        <EmptyFavoritesDeprecated size={STANDARD_ICON_SIZE} />
        <Text> - EmptyFavoritesDeprecated (deprecated) </Text>
      </AlignedText>
      <Illustration name="EmptyFavorites" component={EmptyFavorites} isNew />
      <Illustration name="HappyFaceDeprecated" component={HappyFaceDeprecated} />
      <Illustration name="HappyFace" component={HappyFace} isNew />
      <AlignedText>
        <MaintenanceConeDeprecated
          width={STANDARD_ICON_SIZE * 2}
          height={STANDARD_ICON_SIZE}
          color={ColorsEnum.BLACK}
        />
        <Text> - MaintenanceCone </Text>
      </AlignedText>
      <Illustration name="NoBookingsDeprecated" component={NoBookingsDeprecated} />
      <Illustration name="NoBookings" component={NoBookings} isNew />
      <Illustration name="PhoneError" component={PhoneError} isNew />
      <Illustration name="SadFaceDeprecated" component={SadFaceDeprecated} />
      <Illustration name="SadFace" component={SadFace} isNew />
      <AlignedText>
        <TicketBookedDeprecated width={STANDARD_ICON_SIZE} height={STANDARD_ICON_SIZE} />
        <Text> - TicketBookedDeprecated (deprecated) </Text>
      </AlignedText>
      <Illustration name="TicketBooked" component={TicketBooked} isNew />
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
