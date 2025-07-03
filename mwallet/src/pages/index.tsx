"use client";
import type { NextPage } from "next";
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
  return (
    <div className="h-full">
      <HomeContent />
    </div>
  );
};

export default Home;
