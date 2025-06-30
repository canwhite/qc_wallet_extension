import type { AppProps } from "next/app";
import { Layout } from "@/components/layout";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster />
    </Layout>
  );
}

export default MyApp;
