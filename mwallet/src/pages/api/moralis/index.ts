import type { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis";
// import { EvmChain } from "@moralisweb3/common-evm-utils";

// 模块属性
let isMoralisInitialized = false;

// http://172.16.181.101:3000/api/moralis?address=0xa9A87b3767BdC0ECd8c7B214F102Bdf9EF585B15&chainId=0x1
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  //method一般就两种，query是get请求，body是js请求的
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

  try {
    //how to use in nextjs
    if (!isMoralisInitialized) {
      await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_KEY });
      isMoralisInitialized = true;
    }
    //get tokens
    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chainId,
      address: address
    });

    //get nfts
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chainId,
      address: address,
      mediaItems: true
    });

    const myNfts = nfts.raw.result.map((e: any) => {
      if (
        e?.media?.media_collection?.high?.url &&
        !e.possible_spam &&
        e?.media?.category !== "video"
      ) {
        return e["media"]["media_collection"]["high"]["url"];
      }
    });

    const jsonResponse = {
      tokens: tokens.raw,
      nfts: myNfts
    };
    /**正常的那个token的数据形态 */
    /* 
      {
        token_address,
        name,
        symbol,
        logo,
        thumbnail,
        decimals,
        balance,
        possible_spam //spam是垃圾邮件的意思
      }
    */

    res.status(200).json(jsonResponse);

    //todo
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
