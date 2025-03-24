import { OfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'

export const mockOfferImageDimensions: OfferImageContainerDimensions = {
  backgroundHeight: 100,
  imageStyle: {
    height: 200,
    width: 150,
    maxWidth: 300,
    aspectRatio: 2 / 3,
    borderRadius: 8,
  },
  imageStyleWithoutBorderRadius: {
    height: 200,
    width: 150,
    maxWidth: 300,
    aspectRatio: 2 / 3,
    borderRadius: 0,
  },
}
