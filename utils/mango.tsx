import { MangoAccount, TokenAccount } from '@blockworks-foundation/mango-client'
import { PublicKey } from '@solana/web3.js'
import useMangoStore from '../stores/useMangoStore'

export async function deposit({
  amount,
  fromTokenAcc,
  mangoAccount,
  accountName,
}: {
  amount: number
  fromTokenAcc: TokenAccount
  mangoAccount?: MangoAccount
  accountName?: string
}) {
  const mangoGroup = useMangoStore.getState().selectedMangoGroup.current
  const wallet = useMangoStore.getState().wallet.current
  const tokenIndex = mangoGroup.getTokenIndex(fromTokenAcc.mint)
  const mangoClient = useMangoStore.getState().connection.client
  const referrer = useMangoStore.getState().referrerPk
  console.log('referrerPk', referrer)
  if (!mangoGroup) return

  if (mangoAccount) {
    return await mangoClient.deposit(
      mangoGroup,
      mangoAccount,
      wallet,
      mangoGroup.tokens[tokenIndex].rootBank,
      mangoGroup.rootBankAccounts[tokenIndex].nodeBankAccounts[0].publicKey,
      mangoGroup.rootBankAccounts[tokenIndex].nodeBankAccounts[0].vault,
      fromTokenAcc.publicKey,
      Number(amount)
    )
  } else {
    const existingAccounts = await mangoClient.getMangoAccountsForOwner(
      mangoGroup,
      wallet.publicKey,
      false
    )
    console.log('in deposit and create, referrer is', referrer)
    return await mangoClient.createMangoAccountAndDeposit(
      mangoGroup,
      wallet,
      mangoGroup.tokens[tokenIndex].rootBank,
      mangoGroup.rootBankAccounts[tokenIndex].nodeBankAccounts[0].publicKey,
      mangoGroup.rootBankAccounts[tokenIndex].nodeBankAccounts[0].vault,
      fromTokenAcc.publicKey,
      Number(amount),
      existingAccounts.length,
      accountName,
      referrer
    )
  }
}

export async function withdraw({
  amount,
  token,
  allowBorrow,
}: {
  amount: number
  token: PublicKey
  allowBorrow: boolean
}) {
  const mangoAccount = useMangoStore.getState().selectedMangoAccount.current
  const mangoGroup = useMangoStore.getState().selectedMangoGroup.current
  const wallet = useMangoStore.getState().wallet.current
  const tokenIndex = mangoGroup.getTokenIndex(token)
  const mangoClient = useMangoStore.getState().connection.client

  if (
    typeof tokenIndex !== 'number' ||
    !mangoGroup ||
    !mangoAccount ||
    !wallet ||
    !mangoGroup.rootBankAccounts[tokenIndex]
  ) {
    return
  }
  if (
    typeof tokenIndex === 'number' &&
    mangoGroup &&
    mangoAccount &&
    wallet &&
    mangoGroup.rootBankAccounts?.[tokenIndex] &&
    mangoGroup.rootBankAccounts[tokenIndex] !== undefined &&
    mangoGroup.rootBankAccounts[tokenIndex]?.nodeBankAccounts?.[0]
      ?.publicKey !== undefined &&
    mangoGroup.rootBankAccounts[tokenIndex]?.nodeBankAccounts?.[0].vault !==
      undefined
  ) {
    return await mangoClient.withdraw(
      mangoGroup,
      mangoAccount,
      wallet,
      mangoGroup.tokens[tokenIndex].rootBank,
      mangoGroup.rootBankAccounts[tokenIndex].nodeBankAccounts[0].publicKey,
      mangoGroup.rootBankAccounts[tokenIndex].nodeBankAccounts[0].vault,
      Number(amount),
      allowBorrow
    )
  }
}
