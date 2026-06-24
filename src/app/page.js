import HeroSection from "@/components/HeroSection";
import ChefSpotlight from "@/components/ChefSpotlight";
import PremiumPerks from "@/components/PremiumPerks";
import PopularRecipes from "@/components/PopularRecipes";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        
        <HeroSection></HeroSection>
        <PopularRecipes></PopularRecipes>
        <PremiumPerks></PremiumPerks>
        <ChefSpotlight></ChefSpotlight>
    </div>
  );
}
