import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-[#003366] text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">About UCT</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Mission & Vision
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  History
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Leadership
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Governance
                </a>
              </li>
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">Academics</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Faculties
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Programmes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Student Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Life */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">Campus Life</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Student Housing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Sports & Recreation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Student Clubs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Wellness Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#d4a574]">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+27216503622" className="hover:text-[#d4a574] transition-colors">
                  +27 21 650 3622
                </a>
              </li>
              <li>
                <a href="mailto:info@uct.ac.za" className="hover:text-[#d4a574] transition-colors">
                  info@uct.ac.za
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Campus Maps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4a574] transition-colors">
                  Directions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a4d7a] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <p>&copy; 2026 University of Cape Town. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#d4a574] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#d4a574] transition-colors">
                Terms of Use
              </a>
              <a href="#" className="hover:text-[#d4a574] transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
