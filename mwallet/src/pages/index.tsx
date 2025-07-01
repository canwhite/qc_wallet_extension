"use client";
import type { NextPage } from "next";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import HomeContent from "@/components/HomeContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home: NextPage = () => {
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <div className="">
      {/* <Tabs defaultValue="home" className="w-full mt-4">
        <TabsList className="flex w-full justify-center">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <HomeContent />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs> */}
      <HomeContent />
    </div>
  );
};

export default Home;
