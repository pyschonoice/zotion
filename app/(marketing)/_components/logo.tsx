import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils"; 

const font = Poppins({
  subsets: ["latin"],
  weight: ["400","600"]
});

const Logo = () => {
  return ( 
    <div className="hidden md:flex items-center gap-2">
      <Image
      src="/logo-dark.png"
      height="40"
      width="40"
      alt="Logo" 
      className="dark:hidden"
    />
    <Image
      src="/logo.png"
      height="40"
      width="40"
      alt="Logo"
      className="hidden dark:block" 
    />
    <p className={cn("font-bold",font.className)}>
      Zotion
    </p>
    </div>
   );
}
 
export default Logo;