import type { Metadata } from "next";
import "@/app/globals.css";
import { User, UserProvider } from "@/app/contexts/userContext";
import { getCurrentUser } from "@/app/lib/auth/getCurrentUser";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: `#434360`,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ambiancemaker.com"),
  title: "Ambiance Maker",
  description: `This description will appear in search results`,
  openGraph: {
    title: "Ambiance Maker",
    description: "The opengraph description appears below the image and title",
    url: "https://ambiancemaker.com",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

async function UserWrapper({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <UserProvider user={user}>{children}</UserProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <UserWrapper>{children}</UserWrapper>
      </body>
    </html>
  );
}
