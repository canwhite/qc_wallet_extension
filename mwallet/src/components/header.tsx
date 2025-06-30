import Link from "next/link";
import { Button } from "@/components/ui/button";

const siteTitle = "QC WebApp Scaffold";

export default function Header() {
  return (
    <header className="w-full flex items-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex-1">
        <Link href="/" passHref>
          <span className="group-hover:opacity-80 transition-opacity">
            <h1 className="text-lg font-medium">{siteTitle}</h1>
          </span>
        </Link>
      </div>
      <div>
        <Button variant="outline">Button for Test</Button>
      </div>
    </header>
  );
}
