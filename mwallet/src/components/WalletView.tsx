import { useContext, useState } from "react";
import { Box } from "@/components/ui/box";
import ChainInfoContext, { WalletAndMnemonicContext } from "@/context";
import { IconLogout } from "@tabler/icons-react";
import { Row } from "@/components/ui/row";
import useEvent from "@/hooks/useEvent";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsyncEffect } from "ahooks";
import { CHAINS_CONFIG } from "../pages/chains";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import { Card, CardContent } from "@/components/ui/card";

// Define schema
const FormSchema = z.object({
  address: z
    .string()
    .min(1, "请输入钱包地址")
    .length(42, { message: "钱包地址必须是42个字符" })
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: "无效的以太坊地址格式" }),
  amount: z
    .string()
    .min(1, "请输入转账金额")
    .regex(/^\d*\.?\d+$/, "必须是有效的数字")
    .refine((val) => Number(val) > 0, "金额必须大于0")
});

//给我一些tokens
const testTokens = [
  { symbol: "ETH", name: "Ethereum", balance: 100000000000, decimals: 18 },
  { symbol: "LINK", name: "Chainlink", balance: 100000000000, decimals: 18 }
];

// const testNfts = [
//   "https://fastly.picsum.photos/id/923/200/300.jpg?hmac=eiYSYaG7v46VlrE38Amrg33bd2FzVjaCsQrLMdekyAU",
//   "https://fastly.picsum.photos/id/62/200/300.jpg?hmac=Ova5b3XqMVygL4ZvFJ1MfAehiXKiM1Ol14jN_6widUY",
//   "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b",
//   "https://fastly.picsum.photos/id/62/200/300.jpg?hmac=Ova5b3XqMVygL4ZvFJ1MfAehiXKiM1Ol14jN_6widUY"
// ];

export default function WalletView() {
  const { wallet, seedPhrase, setWallet, setSeedPhrase } = useContext(WalletAndMnemonicContext);
  const { selectedChain } = useContext(ChainInfoContext);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const chainInfo = CHAINS_CONFIG[selectedChain];
  const { tricker } = chainInfo;
  const [hash, setHash] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);

  // Define form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "all", // Validate on both change and blur
    defaultValues: {
      address: "",
      amount: ""
    }
  });

  // const watchedFields = form.watch();
  // // 使用form.formState.errors获取错误信息，当然formState里还有isValid
  // const formErrors = form.formState.errors;

  //get balance data
  const getBalance = async () => {
    const response = await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: wallet,
        chainId: selectedChain
      })
    });
    const data = response.json();
    //refresh data inside
    setBalance(data.balance);
  };

  // get tokens and nfts
  const getTokensAndNfts = async () => {
    const response = await fetch("/api/moralis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: wallet,
        chainId: selectedChain
      })
    });
    const { tokens, nfts } = await response.json();
    // console.log("--tokens,nfts--", tokens, nfts);
    setTokens(tokens);
    setNfts(nfts);
  };

  // Define submit handler
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { address, amount } = data;
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    //然后拿到私钥
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    //然后通过provider和private Key拿到wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
      to: address,
      value: ethers.parseEther(amount.toString()) //parse ether 相当于结构eth，得到的是wei，交易的时候要用wei
    };
    //交易的部分我们try catch
    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);
      const receipt = await transaction.wait();

      if (receipt.status === 1) {
        await Promise.allSettled([getBalance(), getTokensAndNfts()]);
      } else {
        console.log("failed");
      }
    } finally {
      setHash(null);
      setProcessing(false);
    }
  }

  //init
  useAsyncEffect(async () => {
    if (wallet && selectedChain) {
      setLoading(true);
      try {
        await Promise.allSettled([getBalance(), getTokensAndNfts()]);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setLoading(false);
      }
    }
    //初始化的时候也会进行，先这样吧
  }, [wallet, selectedChain]);

  const logout = useEvent(() => {
    setSeedPhrase(null);
    setWallet(null);
    setBalance(null);
    setNfts(null);
    setTokens(null);
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
                  {wallet?.slice(0, 4)}...{wallet?.slice(-4)}
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
        <TabsContent value="3">
          <div className="mt-4">
            {testTokens && testTokens?.length > 0 ? (
              <div>
                <Card className="border-gray-300">
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                <span>you seem to not have tokens yet</span>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="2" className="h-[400px]">
          <div className="h-full py-4">
            {nfts && nfts?.length > 0 ? (
              <CardContent className="flex h-full flex-col items-center overflow-auto">
                {nfts.map((item, index) => {
                  return (
                    <img
                      key={index}
                      src={item}
                      alt="NFT"
                      className="mb-4 h-auto w-full rounded-[8px] object-fill"
                      style={{ aspectRatio: "1/1" }}
                    />
                  );
                })}
              </CardContent>
            ) : (
              <div>
                <span>you seem to not have NTFs yet</span>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="1">
          {loading ? (
            <div className="mt-4 flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-200" />
                <Skeleton className="h-4 w-[230px] bg-gray-200" />
                <Skeleton className="h-4 w-[200px] bg-gray-200" />
                <Skeleton className="h-4 w-[180px] bg-gray-200" />
                <Skeleton className="h-4 w-[150px] bg-gray-200" />
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-[14px]">Native Balance</p>
              <p className="mt-4 text-[18px] font-bold">
                {balance ? Number(balance).toFixed(2) : "0.00"} {tricker}
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>To:</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Amount:</FormLabel>
                        <FormControl>
                          <Input placeholder="amount" {...field} />
                        </FormControl>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={!form.formState.isValid}
                    variant="outline"
                    className="mt-5 w-full bg-blue-300"
                    size="sm"
                    type="submit">
                    Submit
                  </Button>
                  {/* 显示hash的错误 */}
                  {processing && (
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-4 w-4 rounded-full bg-gray-300" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-[12px] text-gray-500">Hover for Tx Hash</p>
                        </TooltipTrigger>
                        <TooltipContent className="mt-2 bg-gray-200">
                          <p>{hash}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </form>
              </Form>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Box>
  );
}
