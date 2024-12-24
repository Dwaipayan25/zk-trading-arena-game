"use client"

import "./globals.css";
import Navbar from "../components/Navbar";
import Rules from "../components/Rules";
import { Web3Provider } from "./Web3Context";


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Web3Provider>
        <Navbar />
        <Rules />
        {children}
        </Web3Provider>
      </body>
    </html>
  );
}
