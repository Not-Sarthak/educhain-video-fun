"use client";
import { FC, ReactNode } from "react";
import { OCConnect } from "@opencampus/ocid-connect-js";

interface OCIDProviderProps {
  children: ReactNode;
}

const opts = {
  redirectUri: "http://localhost:3000/",
  referralCode: "",
};

const OCIDProvider: FC<OCIDProviderProps> = ({ children }) => (
  <OCConnect opts={opts} sandboxMode={true}>
    {children}
  </OCConnect>
);

export default OCIDProvider;
