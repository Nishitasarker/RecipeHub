import Link from "next/link";
import { 
  LogoFacebook, 
  LogoLinkedin, 
  LogoInstagram, 
  LogoGithub 
} from "@gravity-ui/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#030712] text-gray-400 border-t border-gray-900/50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        
        {/* Main Columns Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Column 1: Brand Info & Gravity Socials */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 text-white text-xs">
                🎟️
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Tick<span className="text-pink-500">eto</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              The next-generation event discovery and seamless ticket booking platform 
              connecting passionate organizers with eager attendees.
            </p>
            
            {/* Gravity UI Social Icons Link Wrapper */}
            <div className="flex items-center gap-4 mt-2 text-gray-400">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <LogoFacebook width={20} height={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="X (Twitter)">
                <LogoLinkedin width={20} height={20} />
              </a>
              {/* <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <LogoInstagram width={20} height={20} />
              </a> */}
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <LogoGithub width={20} height={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Discover Events */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Discover Events
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/events/music" className="hover:text-white transition-colors">Music Festivals</Link></li>
              <li><Link href="/events/tech" className="hover:text-white transition-colors">Tech Conferences</Link></li>
              <li><Link href="/events/sports" className="hover:text-white transition-colors">Sports Matches</Link></li>
              <li><Link href="/events/art" className="hover:text-white transition-colors">Art Exhibitions</Link></li>
            </ul>
          </div>

          {/* Column 3: For Organizers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Organizers
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/organizers/create" className="hover:text-white transition-colors">Create Organization</Link></li>
              <li><Link href="/organizers/host" className="hover:text-white transition-colors">Host an Event</Link></li>
              <li><Link href="/organizers/packages" className="hover:text-white transition-colors">Premium Packages</Link></li>
              <li><Link href="/organizers/pricing" className="hover:text-white transition-colors">Pricing & Fees</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-12 border-t border-gray-900/60 pt-8 text-center text-xs text-gray-500">
          <p>
            &copy; {currentYear} Ticketo Inc. All rights reserved. Developed by Antigravity AI.
          </p>
        </div>

      </div>
    </footer>
  );
}