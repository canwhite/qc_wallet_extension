import type { NextPage } from "next";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Home from "@/components/Home";

const Home: NextPage = () => {
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <div className="text-center w-[350px] h-[600px] flex justify-start items-center flex-col bg-[aqua]">
      <header className="flex bg-gray-200 justify-between w-full px-4 py-2 items-center">
        {/* <img src={logo} className="headerLogo" alt="logo" /> */}
        <Avatar>
          <AvatarImage className="p-1" src="./globe.svg" />
        </Avatar>

        <Select
          className="w-[170px]"
          value={selectedChain}
          onValueChange={setSelectedChain}
        >
          <SelectTrigger className="w-[170px] [&[data-state=open]]:bg-gray-100 [&[data-state=open]]:border-gray-300">
            <SelectValue placeholder="Select chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0x1" className="w-[150px]">
              Ethereum
            </SelectItem>
            <SelectItem value="0x13881" className="w-[150px]">
              Mumbai Testnet
            </SelectItem>
            <SelectItem value="0x89" className="w-[150px]">
              Polygon
            </SelectItem>
            <SelectItem value="0xa86a" className="w-[150px]">
              Avalanche
            </SelectItem>
          </SelectContent>
        </Select>
      </header>
    </div>
  );
};

export default Home;
