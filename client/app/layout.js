import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "Lumen Academy",
  description: "Learn practical skills from focused, instructor-led courses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
