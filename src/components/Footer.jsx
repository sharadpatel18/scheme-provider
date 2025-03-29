'use client';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-screen min-h-[447.516px] flex-shrink-0 relative mx-auto mt-auto overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1521 448" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 104.92C0 104.92 206.5 -68.4844 642 62.0155C1077.5 192.515 1521 0 1521 0V447.516H0V104.92Z" fill="#DDECFA"/>
        </svg>
      </div>
      <div className="relative z-10 w-full max-w-[1521px] mx-auto h-full flex flex-col lg:flex-row items-start justify-between py-8 lg:py-[109px] px-4 lg:px-[120px] lg:pr-[165px] overflow-hidden">
        <div className="text-left px-[5px] min-w-[160px] w-full lg:w-auto mb-8 lg:mb-0">
          <h3 className="text-[#1C1D1F] font-['Roboto'] text-lg font-medium mb-5">Get to Know</h3>
          <ul className="space-y-3">
            {['Privacy Policy', 'Cancellation/Refund Policy', 'FAQ', 'Terms of Service'].map((item) => (
              <li key={item}>
                <a href="#" className="text-[#1C1D1F] font-['Noto_Sans'] text-sm hover:text-[#00599F] transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <h3 className="text-[#1C1D1F] font-['Roboto'] text-lg font-medium mt-8 mb-5">Grievance</h3>
          <ul className="space-y-3">
            {['CPGRAMS', 'National Consumer Helpline'].map((item) => (
              <li key={item}>
                <a href="#" className="text-[#1C1D1F] font-['Noto_Sans'] text-sm hover:text-[#00599F] transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-left px-[5px] min-w-[160px] w-full lg:w-auto mb-8 lg:mb-0">
          <h3 className="text-[#1C1D1F] font-['Roboto'] text-lg font-medium mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {[
              'About Us',
              'Dashboard',
              'Schemes',
              'Our Partners',
              'Contact Us',
              'Video Guide',
              'User Manual',
              'Accessibility'
            ].map((item) => (
              <li key={item}>
                <a href="#" className="text-[#1C1D1F] font-['Noto_Sans'] text-sm hover:text-[#00599F] transition-colors duration-300">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-left px-[5px] min-w-[160px] w-full lg:w-auto lg:pt-[110px]">
          <h3 className="text-[#1C1D1F] font-['Roboto'] text-lg font-medium mb-5">Useful Links</h3>
          <div className="flex flex-row flex-wrap gap-5 items-center justify-center lg:justify-start">
            <a href="#" className="inline-flex items-center flex-shrink-0">
              <Image
                src="/images/negd.svg"
                alt="NEGD"
                width={84}
                height={30}
                className="transition-opacity duration-300 hover:opacity-80"
              />
            </a>
            <a href="#" className="inline-flex items-center flex-shrink-0">
              <Image
                src="/images/digitalindia.svg"
                alt="Digital India"
                width={84}
                height={44}
                className="transition-opacity duration-300 hover:opacity-80"
              />
            </a>
            <a href="#" className="inline-flex items-center flex-shrink-0">
              <Image
                src="/images/mygov.svg"
                alt="MyGov"
                width={59}
                height={44}
                className="transition-opacity duration-300 hover:opacity-80"
              />
            </a>
            <a href="#" className="inline-flex items-center flex-shrink-0">
              <Image
                src="/images/indiagov.svg"
                alt="India Gov"
                width={70}
                height={44}
                className="transition-opacity duration-300 hover:opacity-80"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 