"use client";
import type { NextPage } from "next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import HomeContent from "@/components/HomeContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletView from "@/components/WalletView";
import { useRouter } from "next/router";
import ChainInfoContext, { WalletAndMnemonicContext } from "@/context";
import { useContext } from "react";

const Home: NextPage = () => {
  const router = useRouter();
  const { wallet, seedPhrase } = useContext(WalletAndMnemonicContext);

  return (
    <div className="h-full">
      {wallet && seedPhrase ? <WalletView /> : <HomeContent />}
    </div>
  );
};

// the log is on server side
// export async function getServerSideProps(context) {
//   if (context.resolvedUrl === "/") {
//     console.log("----------index");
//   }
//   return { props: {} };
// }

export default Home;
