// Having Record<string, T> is dangerous without noUncheckedIndexedAccess
// because it supposes that every string key is defined
type RecordOfString<T> = Record<string, T | undefined>
