import { useEffect, useState, useContext } from "react";
import { Box } from "@/components/ui/box";
import { WalletAndMnemonicContext } from "@/context";
//add some components

//use context
export default function WalletView() {
  const { wallet, seedPhrase, setWallet, setSeedPhrase } = useContext(
    WalletAndMnemonicContext
  );
  console.log("--wallet--", wallet);
  return <Box>Wallet View</Box>;
}
