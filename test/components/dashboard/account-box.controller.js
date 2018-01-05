'use strict'

describe('AccountBoxController', () => {
  const expect = chai.expect

  let ctrl, ARKTOSHI_UNIT, accounts, bindings

  beforeEach(module('arkclient.constants'))

  beforeEach(() => {
    module('arkclient.components', $provide => {
    })

    inject((_$componentController_, _ARKTOSHI_UNIT_) => {
      ARKTOSHI_UNIT = _ARKTOSHI_UNIT_
      accounts = [
        { balance: 10 * ARKTOSHI_UNIT },
        { balance: 15 * ARKTOSHI_UNIT },
        { balance: 5 * ARKTOSHI_UNIT },
        {}
      ]

      bindings = {
        accountCtrl: {
          getAllAccounts () { return accounts },
          currency: {
            name: 'btc'
          },
          connectedPeer: {
            market: {
              price: {
                btc: '0.1' // Next year price? lol
              }
            }
          }
        }
      }

      ctrl = _$componentController_('accountBox', null, bindings)
    })
  })

  describe('myAccountsBalance()', () => {
    it('sums the balance (in ARK, formatted) of all accounts', () => {
      expect(ctrl.myAccountsBalance()).to.equal('30.00')
    })
  })

  describe('myAccountsCurrencyBalance()', () => {
    context('when it is connected to a maket', () => {
      it('sums the balance (in the configured currency, formatted) of all accounts', () => {
        expect(ctrl.myAccountsCurrencyBalance()).to.equal(3)
      })
    })

    context("when it isn't connected to a maket", () => {
      beforeEach(() => {
        ctrl.accountCtrl.connectedPeer = {}
      })

      it('returns 0', () => {
        expect(ctrl.myAccountsCurrencyBalance()).to.equal(0)
      })
    })
  })

  // TODO: Implement with accountController refreshAccountBalances method
  xdescribe('refreshAccountBalances()', () => {
    context('when the balance of an account changes', () => {
      it('updates the balance', () => {
        expect(ctrl.myAccountsBalance()).to.equal('30.00')
        sinon.stub(bindings.accountCtrl, 'getAllAccounts').returns([
          { balance: 1 * ARKTOSHI_UNIT },
          { balance: 17 * ARKTOSHI_UNIT },
          { balance: 1 * ARKTOSHI_UNIT },
          { balance: 1 * ARKTOSHI_UNIT }
        ])
        ctrl.accountCtrl.refreshAccountBalances()
        expect(ctrl.myAccountsBalance()).to.equal('20.00')
      })
    })
  })
})
