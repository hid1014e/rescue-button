import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "落ち込みレスキューボタン",
  description: "落ち込んだら、ここで励ましを受け取ろう。匿名で匿名な応援。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
