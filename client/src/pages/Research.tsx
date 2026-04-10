import { Microscope, TrendingUp, Users, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Research() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-[#003366] to-[#1a4d7a] text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Research & Innovation</h1>
            <p className="text-xl text-gray-100">Pioneering research addressing global challenges</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Microscope, title: 'Life Sciences', desc: 'Medical and biological research' },
                { icon: TrendingUp, title: 'Technology', desc: 'Innovation and engineering' },
                { icon: Users, title: 'Social Sciences', desc: 'Human and social research' },
                { icon: Globe, title: 'Sustainability', desc: 'Environmental initiatives' },
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
