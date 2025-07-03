import { useState, useContext } from "react";
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
import ChainInfoContext from "@/context";

const Header = () => {
  const { selectedChain, setSelectedChain } = useContext(ChainInfoContext);

  return (
    <header className="flex bg-gray-100 justify-between w-full px-4 py-2 items-center">
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

        <SelectContent className="bg-white">
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
  );
};

export default Header;
