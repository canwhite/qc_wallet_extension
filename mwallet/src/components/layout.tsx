import React, { ReactNode } from "react";
import Header from "./header";

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-3xl">
        {props.children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-700 p-6 text-center">
        <p className="text-base">dapp by Zack - 2025</p>
      </footer>
    </div>
  );
}
