import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight, BookOpen, Microscope, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const heroSlides = [
  {
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663499128038/PhkcLT5ntgJeA3i4SYVidx/uct-hero-campus-RRKyedYFhtRPike5xNmKG8.webp',
    title: 'Welcome to UCT',
    subtitle: 'Africa\'s Leading University',
    cta: 'Explore More',
  },
  {
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663499128038/PhkcLT5ntgJeA3i4SYVidx/uct-hero-graduation-fPr2yMQtDQkRBNhiSscxiH.webp',
    title: 'Celebrate Success',
    subtitle: 'Join Our Graduating Class',
    cta: 'Learn About Programs',
  },
  {
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663499128038/PhkcLT5ntgJeA3i4SYVidx/uct-hero-research-XS4SWALw2uEEuQk3tmb39c.webp',
    title: 'Pioneering Research',
    subtitle: 'Shaping the Future Through Innovation',
    cta: 'Discover Research',
  },
  {
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663499128038/PhkcLT5ntgJeA3i4SYVidx/uct-hero-library-4fByLk8hg8iwPAahcR8WKK.webp',
    title: 'Academic Excellence',
    subtitle: 'World-Class Education and Resources',
    cta: 'Apply Now',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setAutoPlay(false);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Carousel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={currentSlideData.image}
            alt={currentSlideData.title}
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        </div>

        {/* Slide Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {currentSlideData.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-100 mb-8">
                {currentSlideData.subtitle}
              </p>
              <Link href="/study">
                <Button className="bg-[#d4a574] hover:bg-[#c9a961] text-white text-lg px-8 py-6">
                  {currentSlideData.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setAutoPlay(false);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#d4a574] w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: 'Study Programs', href: '/study' },
              { icon: Microscope, label: 'Research', href: '/research' },
              { icon: Users, label: 'Campus Life', href: '/campus-life' },
              { icon: Award, label: 'Admissions', href: '/admissions' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg hover:shadow-lg transition-shadow cursor-pointer group">
                <item.icon className="w-12 h-12 text-[#003366] group-hover:text-[#d4a574] transition-colors" />
                <span className="font-semibold text-gray-800 group-hover:text-[#003366] transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#003366] mb-12">Latest News & Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'UCT Achieves Top 3% Global Ranking',
                excerpt: 'University of Cape Town climbs to its highest position in a decade in the QS World University Rankings.',
                date: 'April 2, 2026',
              },
              {
                title: 'Applications for 2027 Now Open',
                excerpt: 'Prospective students can now apply for undergraduate and postgraduate programmes for the 2027 academic year.',
                date: 'March 28, 2026',
              },
              {
                title: 'Autumn 2026 Graduation Ceremonies',
                excerpt: 'UCT celebrated successful graduation ceremonies with livestreamed events for families worldwide.',
                date: 'March 25, 2026',
              },
            ].map((news, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-[#003366] to-[#1a4d7a]"></div>
                <div className="p-6">
                  <p className="text-sm text-[#d4a574] font-semibold mb-2">{news.date}</p>
                  <h3 className="text-xl font-bold text-[#003366] mb-3">{news.title}</h3>
                  <p className="text-gray-600 mb-4">{news.excerpt}</p>
                  <a href="#" className="text-[#003366] font-semibold hover:text-[#d4a574] transition-colors">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#003366] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join UCT?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Start your journey to academic excellence and make a difference in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-[#d4a574] hover:bg-[#c9a961] text-white px-8 py-6 text-lg">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
