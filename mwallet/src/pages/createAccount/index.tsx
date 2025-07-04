"use client";
import { useState, useContext, useEffect } from "react";
import ContentBox from "@/components/ContentBox";
import Warning from "@/components/Warning";
import { IconBrandInertia } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ethers } from "ethers";
import useEvent from "@/hooks/useEvent";
import { WalletAndMnemonicContext } from "@/context";
import { isNil } from "lodash-es";
import { useRouter } from "next/router";

export default function CreateAccount() {
  const [newSeedPhase, setNewSeedPhase] = useState<string | null>(null);
  const { wallet, seedPhrase, setWallet, setSeedPhrase } = useContext(
    WalletAndMnemonicContext
  );
  const router = useRouter();
  const generateWallet = useEvent(() => {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhase(mnemonic);
  });

  const setWalletAndMnemonic = useEvent(() => {
    setSeedPhrase(newSeedPhase);
    const address = ethers.Wallet.fromPhrase(newSeedPhase).address;
    setWallet(address);
    router.back();
  });

  return (
    <ContentBox>
      <Warning
        className="w-full"
        text="Once you generate the seed phrase , save it securely in order to recover your wallet in the future"
      />
      <Button
        variant="outline"
        className="mt-4 bg-blue-300  w-full"
        size="sm"
        onClick={() => generateWallet()}
      >
        Generate Seed Phrase
      </Button>
      <Card className="mt-4 border-gray-300 ">
        <CardContent className="h-[100px]">
          {newSeedPhase && (
            <div className="whitespace-pre-wrap break-words overflow-auto h-full">
              {newSeedPhase}
            </div>
          )}
        </CardContent>
      </Card>
      <Button
        variant="outline"
        className="mt-4  w-full"
        size="sm"
        onClick={() => setWalletAndMnemonic()}
      >
        Open Your New Wallet
      </Button>
    </ContentBox>
  );
}
