import "./globals.css";
import type { Metadata } from "next";
import ClientShell from "./ClientShell";

export const metadata: Metadata = {
  title: "Alizè",
  description: "AI-powered job matching platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
