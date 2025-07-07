"use client";
import { Box } from "@/components/ui/box";
import { WalletAndMnemonicContext } from "@/context";
import { useContext, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import useEvent from "@/hooks/useEvent";
import { useRouter } from "next/router";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

//1) 先设置输入schema
const FormSchema = z.object({
  seed: z
    .string()
    .min(40, {
      message: "Bio must be at least 40 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
});

export default function RecoverAccount() {
  const { setSeedPhrase, setWallet } = useContext(WalletAndMnemonicContext);
  const [typedSeed, setTypedSeed] = useState("");
  const [nonValid, setNonValid] = useState(false);
  //2）从formSchema解构出来值和用z.infer推导出类型
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();

  //3）submit
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { seed } = data;
    let recoverWallet;
    try {
      recoverWallet = ethers.Wallet.fromPhrase(seed);
    } catch (error: any) {
      console.log(error);
      setNonValid(true);
      return;
    }

    setSeedPhrase(typedSeed);
    setWallet(recoverWallet);
    router.back();
  }

  return (
    <Box>
      <Alert text="Type your seed phrase in the field below to recover your wallet(it should includes 12 words separated with spaces)" />
      {/* 4)form and formField render */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="mt-4 border-gray-300"
                    placeholder="Type your message here."
                    {...field}
                    // 如果想可以人为价格onChange，但是也要实现field中的函数
                    onChange={(e) => {
                      field.onChange(e);
                      setNonValid(false);
                      setTypedSeed(e.target.value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            className="mt-8 bg-blue-300  w-full"
            size="sm"
            type="submit"
            // 因为数据不实时，所以将getValues改为watch了
            disabled={
              !form.watch("seed") ||
              form.watch("seed").split(" ").length !== 12 ||
              form.watch("seed").slice(-1) === " "
            }
          >
            Recover Wallet
          </Button>
          {nonValid && <p className="mt-2 text-red-500">Invalid seed phrase</p>}
        </form>
      </Form>
    </Box>
  );
}
