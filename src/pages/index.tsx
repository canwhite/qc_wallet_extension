"use client";
import type { NextPage } from "next";
import HomeContent from "@/components/HomeContent";
import WalletView from "@/components/WalletView";
import { WalletAndMnemonicContext } from "@/context";
import { useContext } from "react";

const Home: NextPage = () => {
  const { wallet, seedPhrase } = useContext(WalletAndMnemonicContext);

  return <div className="h-full">{wallet && seedPhrase ? <WalletView /> : <HomeContent />}</div>;
};

// the log is on server side
// export async function getServerSideProps(context) {
//   if (context.resolvedUrl === "/") {
//     console.log("----------index");
//   }
//   return { props: {} };
// }

export default Home;
