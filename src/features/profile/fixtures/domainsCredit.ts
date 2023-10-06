export const domains_exhausted_credit_v1 = {
  all: { initial: 50000, remaining: 0 },
  physical: { initial: 30000, remaining: 0 },
  digital: { initial: 30000, remaining: 0 },
}

export const domains_credit_v1 = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

export const domains_credit_v2 = {
  all: { initial: 30000, remaining: 10000 },
  digital: { initial: 20000, remaining: 5000 },
}

export const domains_exhausted_credit_underage = {
  all: { initial: 3000, remaining: 0 },
}

export const domains_credit_underage = {
  all: { initial: 3000, remaining: 1000 },
}

export const domains_credit_no_numeric_ceiling = {
  all: { initial: 30000, remaining: 30000 },
}
