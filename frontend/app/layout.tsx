import { Inter } from "next/font/google";
import "./globals.css";
import OCIDProvider from "../components/providers/ocid-provider";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Video.fun",
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
        <OCIDProvider>
          <Header />
          {children}
          <Footer />
        </OCIDProvider>
      </body>
    </html>
  );
}
