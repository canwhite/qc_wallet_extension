import { memo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconBrandInertia, IconLogin2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

function HomeContent({ className = "" }) {
  const router = useRouter();
  return (
    <div className={cn("flex flex-col justify-between flex-1")}>
      <div className="w-full flex-1 flex-col items-center space-y-3">
        <p className="flex justify-center items-center mt-6">
          <Avatar>
            <AvatarImage src="/globe.svg" />
          </Avatar>
          <span className="ml-2 text-[30px] font-bold text-gray-500 ">
            Wallet
          </span>
        </p>
        <h2 className="text-[18px]">Hey There 👏</h2>
        <h4>Welcome to your Web3 Wallet</h4>
        <Button
          variant="outline"
          className="mt-[70px] bg-blue-300 w-[220px]"
          size="sm"
          onClick={() => router.push("/createAccount")}
        >
          <IconBrandInertia /> Create a Wallet
        </Button>
        <Button variant="outline" className="w-[220px] mt-5" size="sm">
          <IconLogin2 /> Sign in with Seed Phrase
        </Button>
      </div>
      <div className="mb-2 text-[15px] h-[25px] text-gray-500">
        <h4>Created by Zack in 2023</h4>
      </div>
    </div>
  );
}

export default memo(HomeContent);
