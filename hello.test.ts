const hello = (name: string = 'world'): string => {
  return `Hello ${name}`
}

describe('hello', () => {
  it('world', () => {
    expect(hello()).toEqual('Hello world')
  })

  it('foo', () => {
    expect(hello('foo')).toEqual('Hello foo')
  })
})
