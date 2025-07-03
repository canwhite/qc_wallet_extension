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
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";

const Header = () => {
  const { selectedChain, setSelectedChain } = useContext(ChainInfoContext);

  const router = useRouter();
  const currentRoute = router.pathname;
  console.log("current", currentRoute);

  return (
    <header className="flex bg-gray-100 justify-between w-full px-4 py-2 items-center">
      <p className="flex items-center">
        {currentRoute !== "/" && (
          <Button
            variant="outline"
            className="border-none bg-transparent"
            size="sm"
            onClick={() => router.back()}
          >
            <IconChevronLeft stroke={2} />
            Back
          </Button>
        )}
        <Avatar className="ml-1">
          <AvatarImage className="p-1 ml-1" src="./globe.svg" />
        </Avatar>
      </p>

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
