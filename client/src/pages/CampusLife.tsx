import { Dumbbell, Users, Home, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CampusLife() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-[#003366] to-[#1a4d7a] text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Campus Life</h1>
            <p className="text-xl text-gray-100">Experience vibrant student life at UCT</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Dumbbell, title: 'Sports & Recreation', desc: 'State-of-the-art facilities' },
                { icon: Users, title: 'Student Clubs', desc: 'Over 200 student organizations' },
                { icon: Home, title: 'Accommodation', desc: 'On-campus and off-campus housing' },
                { icon: Heart, title: 'Wellness', desc: 'Health and counseling services' },
              ].map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-lg">
                  <item.icon className="w-12 h-12 text-[#d4a574] mb-4" />
                  <h3 className="text-xl font-bold text-[#003366] mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
