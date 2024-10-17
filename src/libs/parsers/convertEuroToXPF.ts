import { DEFAULT_EURO_TO_XPF_RATE } from 'libs/parsers/useGetEuroToXPFRate'

export const convertEuroToXPF = (priceInCents: number, euroToXPFRate?: number) => {
  const XPFRate = euroToXPFRate ?? DEFAULT_EURO_TO_XPF_RATE
  return priceInCents * XPFRate
}
