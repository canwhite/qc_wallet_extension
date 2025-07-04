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
      <WalletAndMnemonicContext.Provider
        value={{ wallet, setWallet, seedPhrase, setSeedPhrase }}
      >
        {/* bg-[aqua] */}
        <div className="text-center w-[350px] h-[600px] flex justify-start items-center flex-col ">
          <Header />
          {/* 注意宽高传递*/}
          <main className="w-full flex-1">{props.children}</main>
        </div>
      </WalletAndMnemonicContext.Provider>
    </ChainInfoContext.Provider>
  );
}
