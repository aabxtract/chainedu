
"use client";

import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import {
  uintCV,
  stringAsciiCV,
  trueCV,
  falseCV,
  PostConditionMode,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  standardPrincipalCV,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

// =============================================================================
// App Configuration
// =============================================================================

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
const network = new StacksTestnet();

// =============================================================================
// Wallet and Contract Management
// =============================================================================

class StacksWalletManager {
  userSession: UserSession;
  network: StacksTestnet;
  contractAddress: string;
  contractName: string;

  constructor() {
    this.userSession = userSession;
    this.network = network;
    // NOTE: These are placeholder values. Replace with your actual contract details.
    this.contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    this.contractName = 'edu-chain';
  }

  // Connect wallet
  connectWallet(onFinish: () => void) {
    showConnect({
      appDetails: {
        name: 'EduChain Records',
        icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '/logo.png',
      },
      redirectTo: '/',
      onFinish,
      userSession: this.userSession,
    });
  }

  // Disconnect wallet
  disconnectWallet() {
    if (this.userSession.isUserSignedIn()) {
        this.userSession.signUserOut(window.location.origin);
    }
  }

  // Check if user is signed in
  isUserSignedIn() {
    return this.userSession.isUserSignedIn();
  }

  // Get user data
  getUserData() {
    if (this.isUserSignedIn()) {
      return this.userSession.loadUserData();
    }
    return null;
  }

  // Get user's STX address for the current network
  getUserAddress() {
    const userData = this.getUserData();
    if (!userData) return null;

    if (this.network.isMainnet()) {
        return userData.profile.stxAddress.mainnet;
    }
    return userData.profile.stxAddress.testnet;
  }

  // ===========================================================================
  // Contract Interaction Functions
  // ===========================================================================

  // Example of a contract call. Adapt to your contract's functions.
  async addRecord(studentAddress: string, course: string, grade: string, year: number, institution: string) {
    try {
      const userData = this.getUserData();
      if (!userData) {
        throw new Error('User not signed in');
      }

      const txOptions = {
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName: 'add-record', // Replace with your actual function name
        functionArgs: [
          standardPrincipalCV(studentAddress),
          stringAsciiCV(course),
          stringAsciiCV(grade),
          uintCV(year),
          stringAsciiCV(institution),
        ],
        senderKey: userData.appPrivateKey,
        validateWithAbi: true,
        network: this.network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction(transaction, this.network);
      
      return {
        txId: broadcastResponse.txid,
        success: true,
      };
    } catch (error) {
      console.error('Error calling contract:', error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  // ===========================================================================
  // Read-Only Contract Calls
  // ===========================================================================

  async getRecords(userAddress: string) {
    try {
        const sender = this.getUserAddress() || this.contractAddress;

        const response = await fetch(
            `${this.network.coreApiUrl}/v2/contracts/call-read/${this.contractAddress}/${this.contractName}/get-records`,
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender: sender,
                arguments: [standardPrincipalCV(userAddress).buf.toString('hex')],
            }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch records: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
      console.error('Error reading contract data:', error);
      return null;
    }
  }
}

export const stacksWalletManager = new StacksWalletManager();
