import React, { FC } from 'react'

import { LocationModal } from 'features/location/components/LocationModal'

export const SearchLocationModal: FC = () => <LocationModal from="search" shouldShowRadiusSlider />
