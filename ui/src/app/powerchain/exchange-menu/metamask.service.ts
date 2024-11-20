// src/app/metamask.service.ts

import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any; // Define the ethereum object
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  async connectToMetamask(): Promise<string> {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = (await provider.listAccounts()).toString();
        return accounts;
      } else {
        throw new Error(
          'MetaMask is not installed! Please install the extension.'
        );
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  async configureMumbaiTestnetNetwork(): Promise<void> {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Mumbai Testnet',
              chainId: '0x13881', // Chain ID should be '0x13881' (hexadecimal)
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              },
              rpcUrls: [
                'https://polygon-mumbai.g.alchemy.com/v2/IQsYQnaWwL9pi-6JRZrfSl3okY8b_BEg'
              ],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/']
            }
          ]
        });
      } else {
        throw new Error(
          'MetaMask is not installed! Please install the extension.'
        );
      }
    } catch (error) {
      console.error('Error configuring Mumbai Testnet network:', error);
      throw error;
    }
  }
}
