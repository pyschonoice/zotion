import Footer from "./_components/footer";
import { Heading } from "./_components/heading";
import Hereos from "./_components/hereos";

const MarketingPage = () => {
  return ( 
    <div className="min-h-full flex flex-col">
      <div className="flex items-center flex-col lg:flex-row justify-center 
      md:justify-start text-center lg:space-x-100 gap-y-8 flex-1 px-6 pb-10 lg:mx-40">
        <Heading/>
        <Hereos/>
      </div>
      <Footer/>
    </div>
   );
}
 
export default MarketingPage;