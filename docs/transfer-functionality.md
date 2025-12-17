# 钱包转账功能文档

## 概述

本文档详细说明了 QC Wallet Extension 中的转账功能实现，包括代码结构、核心逻辑和具体实现细节。

## 项目结构

### 技术栈
- **前端框架**: Next.js 15.3.3 + React 19
- **语言**: TypeScript
- **状态管理**: Jotai + React Context
- **UI组件**: Radix UI + 自定义UI组件库
- **区块链集成**: Ethers.js v6, Moralis API
- **样式**: Tailwind CSS

### 核心文件
- 转账功能主文件: `src/components/WalletView.tsx`
- 余额API: `src/pages/api/balance/index.ts`
- 链配置: `src/pages/chains.tsx`

## 转账功能详细实现

### 1. 表单验证定义

**位置**: `src/components/WalletView.tsx:32-43`

```typescript
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
```

**验证规则**:
- **地址验证**: 42字符长度，以太坊地址格式（0x开头的40位十六进制）
- **金额验证**: 必须是有效数字且大于0

### 2. 表单设置

**位置**: `src/components/WalletView.tsx:72-80`

```typescript
const form = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
  mode: "all", // 在change和blur时都验证
  defaultValues: {
    address: "",
    amount: ""
  }
});
```

**特性**:
- 实时验证（input change和blur事件）
- 使用Zod解析器进行类型安全的表单验证

### 3. 转账核心实现

**位置**: `src/components/WalletView.tsx:118-146`

```typescript
async function onSubmit(data: z.infer<typeof FormSchema>) {
  const { address, amount } = data;
  const chain = CHAINS_CONFIG[selectedChain];
  const provider = new ethers.JsonRpcProvider(chain.rpcUrl);

  // 从助记词获取私钥
  const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;

  // 创建钱包实例，  在 Ethers.js 中，Wallet 实例实际上就是 Signer 的一种具体实现。
  // ethers Wallet 类继承关系class Wallet extends AbstractSigner implements Signer { }
  // 所以可以直接使用它去完成一些交易 
  const wallet = new ethers.Wallet(privateKey, provider);

  // 构建交易对象
  const tx = {
    to: address,
    value: ethers.parseEther(amount.toString()) // 将ETH转换为wei
  };

  setProcessing(true);
  try {
    // 发送交易
    const transaction = await wallet.sendTransaction(tx);
    setHash(transaction.hash);
    const receipt = await transaction.wait();

    if (receipt.status === 1) {
      // 交易成功，刷新余额和代币数据
      await Promise.allSettled([getBalance(), getTokensAndNfts()]);
    } else {
      console.log("交易失败");
    }
  } finally {
    setHash(null);
    setProcessing(false);
  }
}
```

**核心步骤**:
1. **Provider初始化**: 根据选定链配置创建JSON RPC Provider
2. **钱包创建**: 从助记词派生私钥，创建钱包实例
3. **交易构建**: 设置接收地址和转账金额（自动转换为wei）
4. **交易发送**: 调用`wallet.sendTransaction()`
5. **交易确认**: 使用`transaction.wait()`等待区块确认
6. **状态更新**: 成功后刷新余额和代币数据

### 4. 余额获取API

**位置**: `src/pages/api/balance/index.ts`

```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // 参数获取和验证...
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address);
  const balanceEther = await ethers.formatEther(balance);
  res.status(200).json({ balance: balanceEther });
}
```

**功能**:
- 支持GET和POST请求
- 获取指定地址的ETH余额
- 自动转换wei为ether单位

### 5. UI界面实现

**位置**: `src/components/WalletView.tsx:267-339`

#### 组件结构
```typescript
<TabsContent value="1">
  {/* 余额显示 */}
  <p className="text-[14px]">Native Balance</p>
  <p className="mt-4 text-[18px] font-bold">
    {balance ? Number(balance).toFixed(2) : "0.00"} {tricker}
  </p>

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5">
      {/* 接收地址输入 */}
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

      {/* 转账金额输入 */}
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

      {/* 提交按钮 */}
      <Button
        disabled={!form.formState.isValid}
        variant="outline"
        className="mt-5 w-full bg-blue-300"
        size="sm"
        type="submit">
        Submit
      </Button>

      {/* 交易处理状态 */}
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
</TabsContent>
```

#### UI特性
- **余额显示**: 显示当前钱包的原生代币余额
- **表单验证**: 实时显示验证错误信息
- **交互反馈**: 交易处理时显示加载状态和交易哈希
- **响应式设计**: 使用Tailwind CSS实现响应式布局

## 关键特性

### 1. 多链支持
通过`CHAINS_CONFIG`支持不同的区块链网络：
- 动态切换RPC URL
- 支持不同链的原生代币显示

### 2. 安全性
- 助记词不直接暴露在前端
- 使用Ethers.js的安全签名机制
- 输入验证防止格式错误

### 3. 用户体验
- 实时表单验证
- 交易状态可视化
- 自动刷新余额和代币数据
- 错误处理和用户反馈

### 4. 数据同步
- 交易成功后自动调用`getBalance()`和`getTokensAndNfts()`
- 使用`Promise.allSettled`确保数据更新不中断

## 状态管理

### 相关状态变量
```typescript
const [balance, setBalance] = useState(null);
const [hash, setHash] = useState(null);
const [processing, setProcessing] = useState(false);
const [tokens, setTokens] = useState(null);
const [nfts, setNfts] = useState(null);
```

### Context使用
```typescript
const { wallet, seedPhrase, setWallet, setSeedPhrase } = useContext(WalletAndMnemonicContext);
const { selectedChain } = useContext(ChainInfoContext);
```

## 错误处理

### 交易错误处理
```typescript
try {
  const transaction = await wallet.sendTransaction(tx);
  // ... 交易处理
} finally {
  setHash(null);
  setProcessing(false);
}
```

### 数据获取错误处理
```typescript
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
}, [wallet, selectedChain]);
```

## 总结

该转账功能实现了完整的以太坊转账流程，包含：
- 完善的表单验证
- 多链支持
- 实时状态更新
- 用户友好的界面
- 健壮的错误处理

代码结构清晰，遵循现代React开发最佳实践，具有很好的可维护性和扩展性。