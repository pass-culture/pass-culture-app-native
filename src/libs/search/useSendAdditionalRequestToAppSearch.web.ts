export const useSendAdditionalRequestToAppSearch = () => {
  return (_request: () => Promise<unknown>) => () => null
}
