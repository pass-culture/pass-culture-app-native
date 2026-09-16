import React, { FunctionComponent } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { Button } from 'ui/designSystem/Button/Button'
import { Bell } from 'ui/svg/icons/Bell'

type Props = {
  artistName: string
  artistId?: string
  offerType?: SearchGroupNameEnumv2
}

export const FollowArtistButton: FunctionComponent<Props> = ({
  artistName,
  artistId: _artistId,
  offerType: _offerType,
}) => {
  const handlePress = () => {
    return
  }

  return (
    <Button
      wording="Suivre"
      icon={Bell}
      variant="secondary"
      color="neutral"
      size="small"
      accessibilityLabel={`Suivre ${artistName}`}
      onPress={handlePress}
    />
  )
}
