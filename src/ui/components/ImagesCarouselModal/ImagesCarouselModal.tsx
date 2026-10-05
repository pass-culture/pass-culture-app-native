type ImagesCarouselModalProps = {
  imagesURL: string[]
  isVisible?: boolean
  hideModal: () => void
  onClose?: () => void
  defaultIndex?: number
  onSnapToItem?: (index: number) => void
  imageDescription: string
}

export const ImagesCarouselModal = (_props: ImagesCarouselModalProps) => null
