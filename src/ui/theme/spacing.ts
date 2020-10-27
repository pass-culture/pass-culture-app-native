import styled from 'styled-components/native'

const UNIT_SPACE = 4

export const getSpacing = (numberOfSpaces: number): number => UNIT_SPACE * numberOfSpaces
export const getSpacingString = (numberOfSpaces: number): string =>
  `${UNIT_SPACE * numberOfSpaces}px`

interface SpacerProps {
  numberOfSpaces: number
}
const RowSpacer = styled.View<SpacerProps>(({ numberOfSpaces }) => ({
  width: getSpacing(numberOfSpaces),
}))
const ColumnSpacer = styled.View<SpacerProps>(({ numberOfSpaces }) => ({
  height: getSpacing(numberOfSpaces),
}))

interface FlexSpacerProps {
  flex?: number
}
const FlexSpacer = styled.View<FlexSpacerProps>(({ flex }) => ({
  flex: flex ? flex : 1,
}))

export const Spacer = {
  Flex: FlexSpacer,
  Row: RowSpacer,
  Column: ColumnSpacer,
}
