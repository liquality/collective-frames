import { ethers } from 'ethers'
import { CMetadata } from '../types'
import {
  HONEYPOT_ABI,
  COLLECTIVE_FACTORY,
  COLLECTIVE_ABI,
  COLLECTIVE_FACTORY_ABI,
  POOL_ABI,
  C_WALLET_ABI,
  HONNEYPOT_FACTORY,
  HONNEYPOT_FACTORY_ABI,
  OPERATOR_ADDRESS,
  HONEYPOT,
} from './constants'
import { QueryResultRow } from '@vercel/postgres'
import { collective, db } from '@/db'
import { sql } from 'drizzle-orm'


export function collectiveBatchExecuteData(value: bigint[], data: string[], dest: string[], cWalletAddress: string): string {
  const batchExecuteData = new ethers.Contract(cWalletAddress, C_WALLET_ABI).interface.encodeFunctionData('executeBatchWithPay', [dest, value, data])
  return batchExecuteData
}

export async function createCollective(): Promise<CMetadata> {
  try {
    const provider = getProvider()
    const signer = getSigner(provider)

    const cFactory = getCFactory(signer)
    const salt = generateSalt()
    console.log(salt, 'wats salt?')

    const cAddress = await cFactory.getCollective(
      signer.address,
      signer.address,
      salt
    )
    console.log(cAddress, 'cAddress')
    const cWallet = await cFactory.getCWallet(cAddress, signer.address, salt)
    console.log(cWallet, 'cWallet')

    const tx1 = await cFactory.createCollective(
      signer.address,
      signer.address,
      salt
    )
    console.log(tx1, 'tx one')
    await provider.waitForTransaction(tx1.hash)

    const tx2 = await cFactory.createWallet(
      signer.address,
      signer.address,
      salt
    )
    await provider.waitForTransaction(tx2.hash)

    console.log('Collective created successfully! ', tx1, tx2)

    return { address: cAddress, wallet: cWallet, nonceKey: BigInt(salt) }
  } catch (error) {
    throw new Error('Error creating collective: ' + error)
  }
}

export async function createPool(cAddress: string, tokenAddress: string, honeyPot: string): Promise<string> {
  try {
    const provider = getProvider()
    const signer = getSigner(provider)

    const collective = getCollective(signer, cAddress)

    const tx = await collective.createPools(
      [tokenAddress],
      [honeyPot]
    )
    await provider.waitForTransaction(tx.hash)
    console.log('Pool created successfully! ', tx.hash)

    const pool = await collective.pools(honeyPot)
    return pool['id']
  } catch (error) {
    throw new Error('Error creating pool: ' + error)
  }
}

// create honeyPot contract
export async function createHoneyPot(salt: ethers.BigNumberish) {
  try {
    const provider = getProvider()
    const signer = getSigner(provider)

    // Get honeyPot factory
    const hFactory = await getHoneyPotFactory(signer);
    // Get honeyPot address
    console.log(hFactory, 'wats hfactory?')
    const honeyPot = await hFactory.getHoneyPot(OPERATOR_ADDRESS, ethers.toBigInt(salt));
    // create honeyPot
    const tx = await hFactory.createHoneyPot(OPERATOR_ADDRESS, ethers.toBigInt(salt));
    await tx.wait();

    return {
      honeyPot, salt, tx:
      {
        address: honeyPot,
        salt
      }
    }

  } catch (error) {
    console.log("error create honeyPot >>>> ", error)
    throw error;
  }
}



// ======= TODO: Update Logic ==========

export async function setTopCollective(
  topContributor: string
): Promise<string> {
  try {
    const provider = getProvider()
    const signer = getSigner(provider)
    const honeyPot = getHonneyPot(signer, HONEYPOT)

    // console.log("topContributor: ", await honeyPot.getTopContributor());
    const tx = await honeyPot.setTopContributor(topContributor)
    await provider.waitForTransaction(tx.hash)
    console.log('Top contributor set successfully! ', tx.hash)

    return tx.hash
  } catch (error) {
    throw new Error('Error setting top collective: ' + error)
  }
}

// send honeyPot rewards to top contributor
export async function sendRewardToTopCollective(): Promise<string> {
  try {
    const provider = getProvider()
    const signer = getSigner(provider)
    const honeyPot = getHonneyPot(signer, HONEYPOT)

    const tx = await honeyPot.sendReward()
    await provider.waitForTransaction(tx.hash)
    console.log('Rewards sent successfully! ', tx.hash)

    return tx.hash
  } catch (error) {
    throw new Error('Error sending rewards to top collective: ' + error)
  }
}

// Distribute rewards in pool
export async function distributeRewards(poolAddress: string): Promise<string> {
  /*   try {
      const provider = getProvider()
      const signer = getSigner(provider)
      const pool = await getPool(signer, poolAddress)
  
      const tx = await pool.distributeReward()
      await provider.waitForTransaction(tx.hash)
      console.log('Rewards distributed successfully! ', tx.hash)
  
      return tx.hash
    } catch (error) {
      throw new Error('Error distributing rewards: ' + error)
    } */
  return ""
}

// withdraw rewards
export async function batchWithdrawRewards(
  cWalletAddress: string,
  poolAddress: string,
  participants: QueryResultRow[]
): Promise<string> {
  /*   try {
      const provider = getProvider()
      const signer = getSigner(provider)
  
      const cWallet = getCWallet(signer, cWalletAddress)
      let data: string[] = []
      let value: number[] = []
      let dest: string[] = []
  
      for (const participant of participants) {
        const callData = getPoolWithdrawCallData(participant.address)
        data.push(callData)
        value.push(0)
        dest.push(poolAddress)
      }
  
      const tx = await cWallet.executeBatch(dest, value, data, {
        gasLimit: 400000,
      })
      await provider.waitForTransaction(tx.hash)
      console.log('withdrawal successfully!', tx.hash)
  
      return tx.hash
    } catch (error) {
      throw new Error('Error batch withdrawing rewards: ' + error)
    } */
  return ""
}

// withdraw rewards
export async function withdrawRewards(
  poolAddress: string,
  participant: string
): Promise<string> {
  /*   try {
      const provider = getProvider()
      const signer = getSigner(provider)
      const pool = await getPool(signer, poolAddress)
  
      const tx = await pool.withdrawReward(participant)
      await provider.waitForTransaction(tx.hash)
      console.log('Rewards withdrawn successfully! ', tx.hash)
  
      return tx.hash
    } catch (error) {
      throw new Error('Error withdrawing rewards: ' + error)
    } */
  return ""
}

async function getPool(signer: ethers.Wallet, poolAddress: string) {
  const pool = new ethers.Contract(poolAddress, POOL_ABI, signer)
  return pool
}

function getCollective(signer: ethers.ContractRunner, cAddress: string) {
  const collective = new ethers.Contract(cAddress, COLLECTIVE_ABI, signer)
  return collective
}

function getCFactory(signer: ethers.ContractRunner) {
  const cFactory = new ethers.Contract(
    COLLECTIVE_FACTORY,
    COLLECTIVE_FACTORY_ABI,
    signer
  )
  return cFactory
}

function getCWallet(signer: ethers.Wallet, cWalletAddress: string) {
  const cWallet = new ethers.Contract(cWalletAddress, C_WALLET_ABI, signer)
  return cWallet
}

function getHonneyPot(signer: ethers.ContractRunner, honneyPotAddress: string) {
  const honeyPot = new ethers.Contract(honneyPotAddress, HONEYPOT_ABI, signer)
  return honeyPot
}

async function getHoneyPotFactory(signer: ethers.ContractRunner) {
  const hFactory = new ethers.Contract(HONNEYPOT_FACTORY, HONNEYPOT_FACTORY_ABI, signer)
  return hFactory;
}

export function getSigner(provider: ethers.JsonRpcProvider) {
  const signer = ethers.Wallet.fromPhrase(
    process.env.OPERATOR_MNEMONIC as string
  ).connect(provider)
  return signer
}

export function getProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
  return provider
}

export function getRecordPoolMintCallData(
  poolAddress: string,
  creator: string,
  tokenId: bigint,
  contribution: bigint,
  amount: bigint
) {
  const callData = new ethers.Interface(
    COLLECTIVE_ABI
  ).encodeFunctionData('recordPoolMint', [
    poolAddress,
    creator,
    tokenId,
    contribution,
    amount,
  ])
  return callData
}

export function generateSalt(length: number = 16): number {
  const characters = '0123456789'
  const charactersLength = 4
  let salt = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    salt += characters.charAt(randomIndex)
  }

  // Assuming you want to convert the string salt to a BigNumberish
  return Number(salt)
}

function getPoolWithdrawCallData(participant: string) {
  const callData = new ethers.Interface(POOL_ABI).encodeFunctionData(
    'withdrawReward',
    [participant]
  )
  return callData
}

export async function getCollectiveById(id: number) {
  const existingCollective = await db.select().from(collective).where(sql`${collective.id} = ${id}`)
  if (existingCollective[0]) {
    return existingCollective[0]
  }
  else {
    return null
  }
}
