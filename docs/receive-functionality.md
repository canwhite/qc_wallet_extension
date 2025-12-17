# 钱包接收转账功能文档

## 概述

本文档详细分析了 QC Wallet Extension 中当前的接收转账机制，并提供了改进建议和完整的实现方案。

## 当前实现分析

### 现有接收机制

#### 1. 被动轮询机制

**位置**: `src/components/WalletView.tsx:148-159`

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

**触发时机**:
- 钱包地址变化时
- 区块链网络切换时
- 组件初次加载时

#### 2. 手动刷新机制

**位置**: `src/components/WalletView.tsx:138`

```typescript
if (receipt.status === 1) {
  await Promise.allSettled([getBalance(), getTokensAndNfts()]);
}
```

**触发时机**:
- 转账交易成功后
- 手动操作刷新余额

### 现有机制的问题

#### 1. 实时性差
- **问题**: 只在特定时机检查余额，无法实时发现转入交易
- **影响**: 用户需要手动刷新或等待特定时机才能看到新收到的转账

#### 2. 资源浪费
- **问题**: 缺乏智能轮询机制
- **影响**: 可能频繁调用API，浪费网络和服务器资源

#### 3. 用户体验不佳
- **问题**: 没有实时通知机制
- **影响**: 用户无法及时知道收到了转账

#### 4. 功能不完整
- **问题**: 只支持原生代币余额检查
- **影响**: 无法实时发现ERC20代币转账

## 改进方案

### 1. WebSocket实时监听方案

#### 核心实现

```typescript
// 新增文件: src/hooks/useWebSocketListener.ts
import { useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CHAINS_CONFIG } from '../pages/chains';
import { useContext } from 'react';
import { WalletAndMnemonicContext, ChainInfoContext } from '../context';

export const useWebSocketListener = (onReceive: (tx: any) => void) => {
  const { wallet } = useContext(WalletAndMnemonicContext);
  const { selectedChain } = useContext(ChainInfoContext);

  const setupWebSocketListener = useCallback(() => {
    if (!wallet || !selectedChain) return;

    const chain = CHAINS_CONFIG[selectedChain];
    const wsUrl = chain.wsUrl || chain.rpcUrl.replace('https://', 'wss://');

    const provider = new ethers.WebSocketProvider(wsUrl);

    // 监听新区块
    provider.on("block", async (blockNumber) => {
      try {
        // 检查该区块中是否有转入当前地址的交易
        const block = await provider.getBlock(blockNumber, true);
        const incomingTxs = block.transactions.filter(tx =>
          tx.to?.toLowerCase() === wallet.toLowerCase()
        );

        if (incomingTxs.length > 0) {
          incomingTxs.forEach(tx => {
            onReceive({
              type: 'native',
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              blockNumber
            });
          });
        }
      } catch (error) {
        console.error("Error processing block:", error);
      }
    });

    // 监听ERC20 Transfer事件
    const transferFilter = {
      address: null, // 监听所有合约地址
      topics: [
        ethers.id("Transfer(address,address,uint256)"),
        null, // from地址（不关心）
        ethers.zeroPadValue(wallet.toLowerCase(), 32) // to地址（当前钱包）
      ]
    };

    provider.on(transferFilter, (log) => {
      onReceive({
        type: 'erc20',
        hash: log.transactionHash,
        contractAddress: log.address,
        from: ethers.AbiCoder.defaultAbiCoder().decode(['address'], log.topics[1])[0],
        to: ethers.AbiCoder.defaultAbiCoder().decode(['address'], log.topics[2])[0],
        value: ethers.AbiCoder.defaultAbiCoder().decode(['uint256'], log.data)[0],
        blockNumber: log.blockNumber
      });
    });

    return () => {
      provider.removeAllListeners();
    };
  }, [wallet, selectedChain, onReceive]);

  useEffect(() => {
    const cleanup = setupWebSocketListener();
    return cleanup;
  }, [setupWebSocketListener]);
};
```

#### 链配置扩展

```typescript
// 修改: src/pages/chains.tsx
export const CHAINS_CONFIG = {
  '0x1': {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    wsUrl: 'wss://mainnet.infura.io/ws/v3/YOUR_PROJECT_ID', // 新增WebSocket URL
    chainId: '0x1',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorerUrl: 'https://etherscan.io'
  },
  // 其他链配置...
};
```

### 2. 智能轮询备选方案

```typescript
// 新增文件: src/hooks/useSmartPolling.ts
import { useState, useEffect, useCallback } from 'react';
import { useContext } from 'react';
import { WalletAndMnemonicContext, ChainInfoContext } from '../context';

export const useSmartPolling = (onBalanceChange: (oldBalance: string, newBalance: string) => void) => {
  const { wallet } = useContext(WalletAndMnemonicContext);
  const { selectedChain } = useContext(ChainInfoContext);
  const [lastBalance, setLastBalance] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const checkBalance = useCallback(async () => {
    if (isPolling || !wallet) return;

    setIsPolling(true);
    try {
      const response = await fetch("/api/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet, chainId: selectedChain })
      });
      const data = await response.json();

      // 如果余额发生变化，触发回调
      if (lastBalance !== null && data.balance !== lastBalance) {
        onBalanceChange(lastBalance, data.balance);
      }

      setLastBalance(data.balance);
    } catch (error) {
      console.error("Error checking balance:", error);
    } finally {
      setIsPolling(false);
    }
  }, [wallet, selectedChain, lastBalance, onBalanceChange, isPolling]);

  // 每30秒检查一次，或者根据需要调整间隔
  useEffect(() => {
    const interval = setInterval(checkBalance, 30000);
    return () => clearInterval(interval);
  }, [checkBalance]);

  return { lastBalance, isPolling };
};
```

### 3. 通知系统集成

```typescript
// 新增文件: src/components/TransactionNotification.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent } from '@/components/ui/card';
import { Row } from '@/components/ui/row';
import { Separator } from '@/components/ui/separator';
import { IconX } from '@tabler/icons-react';

interface Transaction {
  id: number;
  type: 'native' | 'erc20';
  hash: string;
  from: string;
  to: string;
  value: any;
  contractAddress?: string;
  timestamp: Date;
}

interface TransactionNotificationProps {
  transaction: Transaction;
  onClose: (id: number) => void;
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({
  transaction,
  onClose
}) => {
  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatValue = (value: any, type: string) => {
    if (type === 'native') {
      return `${parseFloat(ethers.formatEther(value)).toFixed(6)} ETH`;
    } else {
      return `${parseFloat(ethers.formatEther(value)).toFixed(6)} Tokens`;
    }
  };

  return (
    <Card className="mb-2 border-green-300 bg-green-50">
      <CardContent className="p-4">
        <Row className="items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">
              {transaction.type === 'native' ? '收到 ETH' : '收到代币'}
            </p>
            <p className="text-xs text-gray-600">
              金额: {formatValue(transaction.value, transaction.type)}
            </p>
            <p className="text-xs text-gray-600">
              来自: {formatAddress(transaction.from)}
            </p>
            <p className="text-xs text-gray-600">
              时间: {transaction.timestamp.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={() => onClose(transaction.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX className="h-4 w-4" />
          </button>
        </Row>
      </CardContent>
    </Card>
  );
};

export const TransactionNotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Transaction[]>([]);

  const addNotification = useCallback((tx: any) => {
    const notification: Transaction = {
      id: Date.now(),
      type: tx.type,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      contractAddress: tx.contractAddress,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev]);

    // 自动移除通知（30秒后）
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 30000);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 全局通知方法
  useEffect(() => {
    // 将 addNotification 暴露到全局供其他组件使用
    (window as any).addTransactionNotification = addNotification;

    return () => {
      delete (window as any).addTransactionNotification;
    };
  }, [addNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {notifications.map(notification => (
        <TransactionNotification
          key={notification.id}
          transaction={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
```

### 4. 完整的WalletView集成

```typescript
// 修改: src/components/WalletView.tsx (在现有代码基础上添加)
import { useWebSocketListener } from '@/hooks/useWebSocketListener';
import { useSmartPolling } from '@/hooks/useSmartPolling';
import { TransactionNotificationManager } from '@/components/TransactionNotification';
import { toast } from 'sonner';

export default function WalletView() {
  // ... 现有代码保持不变 ...

  // WebSocket监听设置
  useWebSocketListener((tx) => {
    // 显示通知
    if (tx.type === 'native') {
      toast.success(`收到 ${ethers.formatEther(tx.value)} ETH`);
    } else {
      toast.success(`收到代币转账`);
    }

    // 刷新数据
    Promise.allSettled([getBalance(), getTokensAndNfts()]);

    // 触发全局通知
    if ((window as any).addTransactionNotification) {
      (window as any).addTransactionNotification(tx);
    }
  });

  // 智能轮询作为备选
  const handleBalanceChange = useCallback((oldBalance: string, newBalance: string) => {
    const diff = Number(newBalance) - Number(oldBalance);
    if (diff > 0) {
      toast.success(`检测到余额增加: ${diff.toFixed(4)} ETH`);
      Promise.allSettled([getBalance(), getTokensAndNfts()]);
    }
  }, []);

  useSmartPolling(handleBalanceChange);

  return (
    <Box>
      <TransactionNotificationManager />
      {/* ... 现有UI代码保持不变 ... */}
    </Box>
  );
}
```

## API扩展

### 批量余额检查API

```typescript
// 新增: src/pages/api/balance/batch.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { addresses, chainId } = req.body;

  // 实现批量地址余额检查
  const balances = await Promise.all(
    addresses.map(async (address: string) => {
      const chainConfig = CHAINS_CONFIG[chainId];
      const provider = new ethers.JsonRpcProvider(chainConfig.rpcUrl);
      const balance = await provider.getBalance(address);
      return {
        address,
        balance: ethers.formatEther(balance)
      };
    })
  );

  res.status(200).json({ balances });
}
```

## 部署和配置

### 1. WebSocket服务配置

确保使用的RPC提供商支持WebSocket连接：

- **Infura**: 提供 WebSocket 端点
- **Alchemy**: 支持 WebSocket 连接
- **自建节点**: 配置 WebSocket 服务

### 2. 错误处理和降级

```typescript
const useRobustListener = () => {
  const [useWebSocket, setUseWebSocket] = useState(true);
  const [wsError, setWsError] = useState(false);

  const handleWebSocketError = useCallback(() => {
    console.warn("WebSocket连接失败，切换到轮询模式");
    setWsError(true);
    setUseWebSocket(false);
  }, []);

  // 根据连接状态选择监听方式
  if (useWebSocket && !wsError) {
    useWebSocketListener(handleReceive);
  } else {
    useSmartPolling(handleBalanceChange);
  }
};
```

## 性能优化

### 1. 请求节流

```typescript
// 防止短时间内重复请求
const throttledRefresh = useCallback(
  throttle(async () => {
    await Promise.allSettled([getBalance(), getTokensAndNfts()]);
  }, 5000),
  []
);
```

### 2. 缓存机制

```typescript
// 添加余额缓存，避免重复请求
const balanceCache = useRef(new Map());
const CACHE_TTL = 10000; // 10秒缓存

const getCachedBalance = useCallback(async (address: string) => {
  const cacheKey = `${address}-${selectedChain}`;
  const cached = balanceCache.current.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.balance;
  }

  // 发起新请求
  const response = await fetch("/api/balance", { /* ... */ });
  const data = await response.json();

  balanceCache.current.set(cacheKey, {
    balance: data.balance,
    timestamp: Date.now()
  });

  return data.balance;
}, [selectedChain]);
```

## 总结

通过以上改进方案，可以实现：

### 功能特性
1. **实时监听**: WebSocket实时检测转账交易
2. **多币种支持**: 同时支持ETH和ERC20代币
3. **智能通知**: 自动通知用户收到转账
4. **自动刷新**: 收到转账后自动更新界面
5. **错误降级**: WebSocket失败时自动切换到轮询模式

### 用户体验
1. **实时性**: 即时发现转入交易
2. **可视化**: 清晰的转账通知界面
3. **响应性**: 余额和代币数据自动更新
4. **稳定性**: 多种监听方式确保可靠性

### 技术优势
1. **性能优化**: 智能轮询减少不必要的请求
2. **可扩展性**: 支持多种转账类型监听
3. **健壮性**: 完善的错误处理机制
4. **可维护性**: 模块化的代码结构

这些改进将显著提升钱包的接收转账功能和用户体验。