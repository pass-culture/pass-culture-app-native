type Writable<MyObject> = {
  -readonly [K in keyof MyObject]: MyObject[K]
}
