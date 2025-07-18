import Image from "next/image";
const Hereos = () => {
  return ( 
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image 
            src="/taking-notes.svg"
            fill
            className="object-contain dark:hidden"
            alt="Taking notes"
          />
          <Image 
            src="/image-dark.png"
            fill
            className="object-contain hidden dark:block"
            alt="Taking notes"
          />
        </div>
      </div>
    </div>
   );
}
 
export default Hereos;