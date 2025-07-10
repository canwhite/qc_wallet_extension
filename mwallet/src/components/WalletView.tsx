import { useContext } from "react";
import { Box } from "@/components/ui/box";
import { WalletAndMnemonicContext } from "@/context";
import { IconLogout } from "@tabler/icons-react";
import { Row } from "@/components/ui/row";
import useEvent from "@/hooks/useEvent";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//use context
export default function WalletView() {
  const { wallet, setWallet, setSeedPhrase } = useContext(WalletAndMnemonicContext);

  const logout = useEvent(() => {
    setSeedPhrase(null);
    setWallet(null);
  });

  return (
    <Box>
      <Row className="">
        <Row>
          <div className="flex-1">
            <p className="text-[14px] font-bold">Wallet</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-[12px] text-gray-500">
                  {wallet.slice(0, 4)}...{wallet.slice(38)}
                </p>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-200">
                <p>{wallet}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex justify-end" onClick={logout}>
            <IconLogout className="h-5 w-5" stroke={2} />
          </div>
        </Row>
      </Row>
      <Separator className="my-4 bg-gray-200" />
      <Tabs defaultValue="1" className="flex justify-center">
        <TabsList className="flex w-full justify-center border-0">
          <TabsTrigger value="3">Tokens</TabsTrigger>
          <TabsTrigger value="2">NFTs</TabsTrigger>
          <TabsTrigger value="1">Transfer</TabsTrigger>
        </TabsList>
        <TabsContent value="3">Tokens</TabsContent>
        <TabsContent value="2">NFTs</TabsContent>
        <TabsContent value="1">Transfer</TabsContent>
      </Tabs>
    </Box>
  );
}
