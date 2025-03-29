'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Helpline from '@/components/chatbot/Helpline';
import ReportForm from '@/components/chatbot/ReportForm';
import Emergency from '@/components/chatbot/Emergency';
import Health from '@/components/chatbot/Health';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  // Header States
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHelpline, setShowHelpline] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [user , setUser] = useState({})

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('profileData'))

    if (data) {
      setUser(data);
    }else{
      setUser({});
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);

  }, []);

  // Add navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  };

  // Carousel Data
  const carouselImages = [
    { src: '/images/1.png', alt: 'India Gate' },
    { src: '/images/2.png', alt: 'Farmer' },
    { src: '/images/3.png', alt: 'Students' },
    { src: '/images/4.png', alt: 'Digital India' },
    { src: '/images/5.png', alt: 'Government Services' },
  ];

  // Quick Services Data
  const services = [
    {
      id: 1,
      title: 'Health',
      description: 'Quick medical service, one click ambulance and more...',
      icon: '/Top header SVG/Health.svg',
      iconBg: 'bg-white',
      onClick: () => setShowHealth(true)
    },
    {
      id: 2,
      title: 'Emergency',
      description: 'Quick Emergency service, Women/Children Helpline, one click police support',
      icon: '/Top header SVG/emergency.svg',
      iconBg: 'bg-white',
      onClick: () => setShowEmergency(true)
    },
    {
      id: 3,
      title: 'Report Issues',
      description: 'File Complaints Against Govt Services & Report a Crime Instantly',
      icon: '/Top header SVG/report.svg',
      onClick: () => setShowReportForm(true)
    },
    {
      id: 4,
      title: 'Helpline',
      description: '24/7 support and grievance redressal & all necessary helpline numbers',
      icon: '/Top header SVG/telephone.svg',
      onClick: () => setShowHelpline(true)
    }
  ];

  // Topics Data
  const topics = [
    {
      id: 1,
      title: 'The India and its government',
      description: 'Learn about India\'s laws, history, and government services. Stay informed about policies that impact citizens.',
      icon: '/Top header SVG/Services/india.svg'
    },
    {
      id: 2,
      title: 'Complaints',
      description: 'File complaints involving government agencies, telemarketers, products and services, travel, housing, and banking. Get guidance on resolving issues quickly.',
      icon: '/Top header SVG/Services/Complain.svg'
    },
    {
      id: 3,
      title: 'Disability services',
      description: 'Find government benefits and programs for people with disabilities and their families. Get support for education, employment, and healthcare.',
      icon: '/Top header SVG/Services/disablity.svg'
    },
    {
      id: 4,
      title: 'Disasters and emergencies',
      description: 'Learn about disaster relief and find government benefits for other emergencies. Access resources to stay prepared and recover faster.',
      icon: '/Top header SVG/Services/disaster.svg'
    },
    {
      id: 5,
      title: 'Scams and fraud',
      description: 'Report a scam and get help. Learn about identity theft, social security scams, and ways to protect yourself from fraud.',
      icon: '/Top header SVG/Services/scam.svg'
    },
    {
      id: 6,
      title: 'Education',
      description: 'Find student benefits, scholarship programs, and courses that help students. Explore skill development programs and government grants.',
      icon: '/Top header SVG/Services/Education.svg'
    },
    {
      id: 7,
      title: 'Government benefits',
      description: 'Find government schemes that may help pay for food, housing, healthcare, and more. Discover financial aid and social security support.',
      icon: '/Top header SVG/Services/benefits.svg'
    },
    {
      id: 8,
      title: 'Health',
      description: 'Get information about health insurance, various health conditions, and help with medical bills. Learn about free medical checkups and vaccination programs.',
      icon: '/Top header SVG/Services/Health.svg'
    }
  ];

  // Header Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 55);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-6 md:px-8 lg:px-12 pt-8">
        {/* Welcome Section */}
        <section className="max-w-[1520px] mx-auto">
          <div className="flex flex-col items-start ">
            <h1 className="text-3xl font-semibold text-gray-900 flex items-center">
              <span className="mr-3">👋</span>
                Hey, { Object?.keys(user).length > 0 ? user?.firstName + " " + user?.lastName : "User"}
            </h1> 
            <div className="my-2 mx-14 w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="py-2 max-w-[1520px] mx-auto">
          <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {carouselImages.concat(carouselImages).map((image, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 p-2">
                  <div className="aspect-[16/8.5] relative">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </section>

        {/* Quick Services Section */}
        <section className="py-10">
          <div className="max-w-[1520px] mx-auto">
            <div className='mb-6'>

            <h2 className="text-3xl font-semibold text-gray-900 flex items-center mb-2 px-4">
              <span className="mr-3">🔗</span>
              Quick Services
            </h2>
              <div className="ml-18 w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gradient-to-r from-[#D0F9BE] to-[#ADE9F1] rounded-xl px-6 py-4 flex items-center gap-4 transition-all hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden cursor-pointer"
                  onClick={service.onClick}
                >
                  <div className={`w-16 h-16 flex items-center justify-center ${service.iconBg || 'bg-gray-50'} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={64}
                      height={64}
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Services Section */}
        <section className="">
          <div className="max-w-[1520px] mx-auto md:px-8 lg:px-0">
            <div className="relative aspect-[16/2] mx-auto">
              <Image
                src="/Top header SVG/AllServises.svg"
                alt="All Services"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="py-12">
          <div className="max-w-[1520px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl p-6 flex flex-col gap-4 transition-all hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  
                  <div className="w-14 h-14 bg-gray-50 rounded-xl p-3 group-hover:bg-blue-50 transition-colors">
                    <Image
                      src={topic.icon}
                      alt={topic.title}
                      width={56}
                      height={56}
                      className="object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                      {topic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Helpline Component */}
      {showHelpline && <Helpline onClose={() => setShowHelpline(false)} />}
      
      {/* Report Form Component */}
      {showReportForm && <ReportForm onClose={() => setShowReportForm(false)} />}

      {/* Emergency Component */}
      {showEmergency && <Emergency onClose={() => setShowEmergency(false)} />}

      {/* Health Component */}
      {showHealth && <Health onClose={() => setShowHealth(false)} />}
    </main>
  );
} 