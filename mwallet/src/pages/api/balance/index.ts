import { ethers } from "ethers";
import { CHAINS_CONFIG } from "./../../chains";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //of course，we can get info in this way
  const { method, query, body } = req;

  let address, chainId;

  // 如果是GET请求，从query中获取参数
  if (method === "GET") {
    address = query.address;
    chainId = query.chainId;
    console.log("GET 请求参数:", { address, chainId });
  }

  // 如果是POST请求，从body中获取参数
  else if (method === "POST") {
    address = body.address;
    chainId = body.chainId;
    console.log("POST 请求参数:", { address, chainId });
  }

  // 验证必要参数
  if (!address || !chainId) {
    return res.status(400).json({
      err: {
        name: "BadRequest",
        message: "Missing required parameters: address and chainId"
      }
    });
  }

  // 然后根据chainId，去获取对应的rpcUrl
  const chainConfig = CHAINS_CONFIG[chainId];
  if (!chainConfig) {
    return res.status(400).json({
      err: {
        name: "BadRequest",
        message: `Unsupported chainId: ${chainId}`
      }
    });
  }
  const { rpcUrl } = chainConfig;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  // 除了getBalance，Provider还提供了以下常用方法：
  // 1. getBlockNumber() - 获取最新区块号
  // 2. getBlock(blockHashOrBlockNumber) - 获取区块信息
  // 3. getTransaction(transactionHash) - 获取交易详情
  // 4. getTransactionReceipt(transactionHash) - 获取交易收据
  // 5. getCode(address) - 获取合约字节码
  // 6. getStorageAt(address, position) - 获取合约存储数据
  // 7. getLogs(filter) - 获取事件日志
  // 8. getNetwork() - 获取网络信息
  // 9. getGasPrice() - 获取当前gas价格
  // 10. estimateGas(transaction) - 估算交易gas消耗
  // 11. call(transaction) - 执行只读调用
  // 12. sendTransaction(signedTransaction) - 发送已签名的交易
  const balance = await provider.getBalance(address);
  //将wei转化为eth并返回
  const balanceEther = await ethers.formatEther(balance);
  res.status(200).json({ balance: balanceEther });
}
