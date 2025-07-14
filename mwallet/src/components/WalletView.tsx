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

//form部分
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

//0,define schema
const formSchema = z.object({
  address: z
    .string()
    .length(42, {
      message: "Address must be 42 characters long."
    })
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum address format."
    }),
  // 金额通常是数字类型，表示以太坊或其他代币的数量
  amount: z.number().min(0, {
    message: "Amount must be a positive number."
  })
});

//use context
export default function WalletView() {
  const { wallet, setWallet, setSeedPhrase } = useContext(WalletAndMnemonicContext);
  const { selectedChain } = useContext(ChainInfoContext);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  console.log("selected chain", selectedChain);
  const chainInfo = CHAINS_CONFIG[selectedChain];
  const { tricker } = chainInfo;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // address: ""
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  useAsyncEffect(async () => {
    if (wallet) {
      setBalanceLoading(true);
      try {
        const response = await fetch("/api/balance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            address: wallet,
            chainId: selectedChain
          })
        });
        const data = await response.json();
        const balance = data.balance;
        setBalance(balance);
        setBalanceLoading(false);
      } catch (error) {
        setBalanceLoading(false);
        console.error("Error fetching balance:", error);
      }
    }
  }, []);

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
        <TabsContent value="1">
          {balanceLoading ? (
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
              <p className="text-[14px]"> Native Balance</p>
              <p className="mt-4 text-[18px] font-bold">
                {Number(balance).toFixed(2)}&nbsp;{tricker}
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To:</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount:</FormLabel>
                        <FormControl>
                          <Input placeholder="amount" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={
                      !form.watch("address") ||
                      !form.watch("amount") ||
                      isNaN(Number(form.watch("amount"))) ||
                      Number(form.watch("amount")) <= 0
                    }
                    variant="outline"
                    className="mt-5 w-full bg-blue-300"
                    size="sm"
                    type="submit">
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Box>
  );
}
