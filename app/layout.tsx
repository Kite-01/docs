import type { Metadata } from "next";
import { Provider } from "@/components/provider";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.usekite.site"),
  title: { template: "%s · Kite docs", default: "Kite docs" },
  description:
    "Crypto payment links and checkout. Customers pay in any token; you are paid in USDC.",
  icons: { icon: "/favicon.svg" },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
