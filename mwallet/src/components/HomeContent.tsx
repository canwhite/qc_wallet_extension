import { memo } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconBrandInertia, IconLogin2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
// import ChainInfoContext from "@/context";

interface HomeContentProps {
  className?: string;
}

function HomeContent({ className = "" }: HomeContentProps) {
  // const { selectedChain } = useContext(ChainInfoContext);
  // console.log("-chain-", selectedChain);
  const router = useRouter();

  return (
    <div className={cn("flex h-full flex-col justify-between", className)}>
      <div className="w-full flex-1 flex-col items-center space-y-3">
        <p className="mt-6 flex items-center justify-center">
          <Avatar>
            <AvatarImage src="/globe.svg" />
          </Avatar>
          <span className="ml-2 text-[30px] font-bold text-gray-500">Wallet</span>
        </p>
        <h2 className="text-[18px]">Hey There 👏</h2>
        <h4>Welcome to your Web3 Wallet</h4>
        <Button
          variant="outline"
          className="mt-[70px] w-[220px] bg-blue-300"
          size="sm"
          onClick={() => router.push("/createAccount")}>
          <IconBrandInertia /> Create a Wallet
        </Button>
        <Button
          onClick={() => router.push("/recoverAccount")}
          variant="outline"
          className="mt-5 w-[220px]"
          size="sm">
          <IconLogin2 /> Sign in with Seed Phrase
        </Button>
      </div>
      {/* 上边flex-1，下边自动高度，创建fix结果 */}
      <div className="mb-2 h-[25px] text-[15px] text-gray-500">
        <h4>Created by Zack in 2023</h4>
      </div>
    </div>
  );
}

export default memo(HomeContent);
