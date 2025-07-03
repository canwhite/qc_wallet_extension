import React, { ReactNode, useState } from "react";
import Header from "./Header";
import ChainInfoContext from "@/context";

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <ChainInfoContext.Provider value={{ selectedChain, setSelectedChain }}>
      {/* bg-[aqua] */}
      <div className="text-center w-[350px] h-[600px] flex justify-start items-center flex-col ">
        <Header />
        {/* 结构里注意通过层级传递总高度 */}
        <main className="flex-1">{props.children}</main>
      </div>
    </ChainInfoContext.Provider>
  );
}
