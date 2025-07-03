"use client";
import { useState } from "react";
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

export default function CreateAccount() {
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
        // onClick={()=>generateWallet()}
      >
        Generate Seed Phrase
      </Button>
      <Card className="mt-4">
        <CardHeader></CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Button
        variant="outline"
        className="mt-4  w-full"
        size="sm"
        // onClick={() => setWalletAndMnemonic()}
      >
        Open Your New Wallet
      </Button>

      {/* <Button
        variant="outline"
        className="mt-4  w-[220px]"
        size="sm"
        // onClick={() => setWalletAndMnemonic()}
      >
        Back Home
      </Button> */}
    </ContentBox>
  );
}
