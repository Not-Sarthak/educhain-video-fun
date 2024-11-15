import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/providers/wallet-context";
import { Header } from "@/components/header/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "edu.fun",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <Header />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
