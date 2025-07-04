import { useEffect, useState, useContext } from "react";
import { Box } from "@/components/ui/box";
import { WalletAndMnemonicContext } from "@/context";
import { IconLogout } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/row";
import useEvent from "@/hooks/useEvent";

//use context
export default function WalletView() {
  const { wallet, seedPhrase, setWallet, setSeedPhrase } = useContext(
    WalletAndMnemonicContext
  );

  console.log(wallet);
  console.log(seedPhrase);

  const logout = useEvent(() => {
    setSeedPhrase(null);
    setWallet(null);
  });

  return (
    <Box>
      <Row className="justify-end">
        <div className="flex justify-end" onClick={logout}>
          <IconLogout stroke={2} />
        </div>
      </Row>
    </Box>
  );
}
