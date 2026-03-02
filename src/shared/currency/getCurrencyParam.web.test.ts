import { CurrencyEnum } from 'api/gen'

import { getCurrencyFromParam } from './getCurrencyParam'

describe('getCurrencyFromParam', () => {
  beforeEach(() => {
    window.history.pushState({}, '', 'http://localhost/')
  })

  it('returns XPF when currency param is XPF', () => {
    window.history.pushState({}, '', 'http://localhost/?currency=XPF')

    expect(getCurrencyFromParam()).toBe(CurrencyEnum.XPF)
  })

  it('returns undefined when currency param is missing', () => {
    expect(getCurrencyFromParam()).toBeUndefined()
  })

  it('returns undefined when currency param is not supported', () => {
    window.history.pushState({}, '', 'http://localhost/?currency=EUR')

    expect(getCurrencyFromParam()).toBeUndefined()
  })
})
