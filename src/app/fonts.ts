import { Noto_Kufi_Arabic, Outfit, Plus_Jakarta_Sans } from "next/font/google";

const body = Plus_Jakarta_Sans({ variable: "--font-body", subsets: ["latin"] });
const display = Outfit({ variable: "--font-display", subsets: ["latin"] });
const arabic = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
});

export const fontClasses = `${body.variable} ${display.variable} ${arabic.variable}`;
