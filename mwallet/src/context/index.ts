import { createContext } from "react";
//chainInfo, provider and consumer
const ChainInfoContext = createContext<string>("0x1");
export default ChainInfoContext;

// wallet and mnemonic
type WalletAndMnemonicType = {
  //   wallet: ethers.Wallet | null;
  //   setWallet: (wallet: ethers.Wallet | null) => void;
  wallet: string | null;
  setWallet: (wallet: string | null) => void;
  seedPhrase: string | null;
  setSeedPhrase: (phrase: string | null) => void;
};

const WalletAndMnemonicContext = createContext<WalletAndMnemonicType>({
  wallet: null,
  setWallet: () => {},
  seedPhrase: null,
  setSeedPhrase: () => {}
});

export { WalletAndMnemonicContext };
