import "./globals.css";
import { ShopProvider } from "./store";
import { Footer, Header } from "./components";

export const metadata = { title: "FreshBites", description: "Find your next delicious meal." };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ShopProvider><Header />{children}<Footer /></ShopProvider>
      </body>
    </html>
  );
}
