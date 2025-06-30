import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { Button } from "@/components/ui/button";
// import useEvent from "@/hooks/useEvent";
import { useCounter } from "@/store/index";

// declare let window: any;

const Home: NextPage = () => {
  const { count, increment, decrement, reset } = useCounter();
  return (
    <div className="flex flex-col items-center  w-full h-full">
      <Head>
        <title>My DAPP</title>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Counter</h1>

        <div className="text-center mb-6">
          <span className="text-2xl font-semibold">Current Count:</span>
          <span
            className={`ml-2 text-4xl font-bold ${
              count > 0
                ? "text-green-600"
                : count < 0
                ? "text-red-600"
                : "text-gray-800"
            }`}
          >
            {count}
          </span>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={decrement}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Decrement
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={increment}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Increment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
