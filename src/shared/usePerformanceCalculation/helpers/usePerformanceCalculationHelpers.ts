export class IActionner {
  getName(transaction)
  startTransaction(name: string)
  endTransaction(transaction)
}

export class ITransactions {
  constructor(actionner: IActionner) {
    this.transactions = []
    this.actionner = actionner
  }

  getTransactionIndex(name: string) {
    return this.transactions.findIndex(
      (transaction) => this.actionner.getName(transaction) === name
    )
  }

  addTransaction(name: string) {
    const itemIndex = this.getTransactionIndex(name)
    if (itemIndex <= 0) {
      const transaction = this.actionner.startTransaction(name)
      this.transactions.push(transaction)
    }
  }

  removeTransaction(name: string) {
    const itemIndex = this.getTransactionIndex(name)
    if (itemIndex > -1) {
      this.actionner.endTransaction(this.transactions[itemIndex])
      this.transactions.splice(itemIndex, 1)
    }
  }

  removeAllTransactions() {
    this.transactions.forEach((transaction) => {
      this.actionner.endTransaction(transaction)
    })
    this.transactions = []
  }
}
