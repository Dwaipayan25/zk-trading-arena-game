import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "ZK Trading Arena Game",
  description: "Master trading and compete in a blockchain-powered game!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
