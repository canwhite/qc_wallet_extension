import React, { ReactNode, useState } from "react";
import Header from "./Header";
import ChainInfoContext, { WalletAndMnemonicContext } from "@/context";

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  const [selectedChain, setSelectedChain] = useState("0x1");
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);

  return (
    <ChainInfoContext.Provider value={{ selectedChain, setSelectedChain }}>
      <WalletAndMnemonicContext.Provider value={{ wallet, setWallet, seedPhrase, setSeedPhrase }}>
        {/* bg-[aqua] */}
        <div className="flex h-[600px] w-[350px] flex-col items-center justify-start text-center">
          <Header />
          {/* 注意宽高传递*/}
          <main className="w-full flex-1">{props.children}</main>
        </div>
      </WalletAndMnemonicContext.Provider>
    </ChainInfoContext.Provider>
  );
}
