import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export function Layout(props: Props) {
  return (
    <div className="text-center w-[350px] h-[600px] flex justify-start items-center flex-col bg-[aqua]">
      <Header />
      <main>{props.children}</main>
    </div>
  );
}
