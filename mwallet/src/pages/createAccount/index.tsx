"use client";
import { useState } from "react";
import ContentBox from "@/components/ContentBox";
import Warning from "@/components/Warning";

export default function CreateAccount() {
  return (
    <ContentBox>
      <Warning text="Once you generate the seed phrase , save it securely in order to recover your wallet in the future" />
    </ContentBox>
  );
}
