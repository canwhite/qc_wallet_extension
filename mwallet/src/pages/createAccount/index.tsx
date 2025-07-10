"use client";
import { useState, useContext } from "react";
import { Box } from "@/components/ui/box";
import { Alert } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ethers } from "ethers";
import useEvent from "@/hooks/useEvent";
import { WalletAndMnemonicContext } from "@/context";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";

export default function CreateAccount() {
  const [newSeedPhase, setNewSeedPhase] = useState<string | null>(null);
  const { setWallet, setSeedPhrase } = useContext(WalletAndMnemonicContext);
  const router = useRouter();
  const generateWallet = useEvent(() => {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhase(mnemonic);
  });

  const setWalletAndMnemonic = useEvent(() => {
    if (isNil(newSeedPhase)) return;

    setSeedPhrase(newSeedPhase);
    const address = ethers.Wallet.fromPhrase(newSeedPhase).address;
    setWallet(address);
    router.back();
  });

  return (
    <Box>
      <Alert
        className="w-full"
        text="Once you generate the seed phrase , save it securely in order to recover your wallet in the future"
      />
      <Button
        variant="outline"
        className="mt-4 w-full bg-blue-300"
        size="sm"
        onClick={() => generateWallet()}>
        Generate Seed Phrase
      </Button>
      <Card className="mt-4 border-gray-300">
        <CardContent className="h-[100px]">
          {newSeedPhase && (
            <div className="h-full overflow-auto break-words whitespace-pre-wrap">
              {newSeedPhase}
            </div>
          )}
        </CardContent>
      </Card>
      <Button
        variant="outline"
        className="mt-4 w-full"
        size="sm"
        onClick={() => setWalletAndMnemonic()}>
        Open Your New Wallet
      </Button>
    </Box>
  );
}
