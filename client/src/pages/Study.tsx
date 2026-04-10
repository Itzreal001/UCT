import { Link } from 'wouter';
import { BookOpen, Users, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Study() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#003366] to-[#1a4d7a] text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Study at UCT</h1>
            <p className="text-xl text-gray-100 max-w-2xl">
              Explore world-class academic programmes and join thousands of students pursuing excellence.
            </p>
          </div>
        </section>

        {/* Programme Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-[#003366] mb-12">Our Programmes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: BookOpen, title: 'Undergraduate', desc: 'Bachelor degrees across multiple disciplines' },
                { icon: Award, title: 'Postgraduate', desc: 'Master\'s and PhD programmes' },
                { icon: Globe, title: 'International', desc: 'Study abroad and exchange programmes' },
                { icon: Users, title: 'Professional', desc: 'Short courses and professional development' },
              ].map((prog, idx) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                  <prog.icon className="w-12 h-12 text-[#d4a574] mb-4" />
                  <h3 className="text-xl font-bold text-[#003366] mb-2">{prog.title}</h3>
                  <p className="text-gray-600">{prog.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#003366] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
            <Link href="/register">
              <Button className="bg-[#d4a574] hover:bg-[#c9a961] text-white px-8 py-3">
                Start Your Application
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
