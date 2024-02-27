import "./app.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humberto Piaia - Full Stack engineer",
  description: "I'm Humberto Piaia, a Brazilian full stack engineer!",
};

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
