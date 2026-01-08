// File: vitotech-main/Frontend/VitoTech/src/pages/Home.tsx
import { useEffect } from 'react';

import Header from '../components/Header/Header';
import Swiper from '../components/Swiper/Swiper';
import Services from '../components/Services';
import LatestProjects from '../components/LatestProjects';
import YearsOfExperience from '../components/YearOfExperience';
import MeetTheTeam from '../components/MeetTheTeam';
import GetMoreWithUs from '../components/GetMoreWithUs';
import WhatPeopleSay from '../components/WhatPeopleSay';
import Cta from '../components/Cta/Cta';
import LatestBlogPosts from '../components/LatestBlogPosts';
import ContactInformation from '../components/ContactInformation';
import ContactForm from '../components/ContactForm';
import RDGoogleMap from '../components/RDLeafletMap';
import Footer from '../components/Footer';

function Home() {
useEffect(() => {
    const preloader = document.querySelector(
      ".preloader"
    ) as HTMLElement | null;

    if (!preloader) return;
    const timer = window.setTimeout(() => {
      preloader.style.display = "none";
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="preloader">
        <div className="preloader-body">
          <div className="cssload-container"><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div>
        <div id="home">
          {/* Top Banner
          <a className="section section-banner text-center d-none d-xl-block" href="https://www.templatemonster.com/intense-multipurpose-html-template.html" style="background-image: url(images/banner/banner-bg-02-1920x60.jpg); background-image: -webkit-image-set( url(images/banner/banner-bg-02-1920x60.jpg) 1x, url(images/banner/banner-bg-02-3840x120.jpg) 2x )" target="_blank"><img src="images/banner/banner-fg-02-1600x60.png" srcset="images/banner/banner-fg-02-1600x60.png 1x, images/banner/banner-fg-02-3200x120.png 2x" alt="" width="1600" height="310"></a>
           */}
          
          {/* Page Header */}
          <Header />

          {/* Swiper */}
          <Swiper />

        </div>
        {/* Services */}
        <Services />

        {/* Cta */}
        <Cta />

        {/* Latest Projects */}
        <LatestProjects />

        {/* Years of experience */}
        <YearsOfExperience />

        {/* Meet The Team */}
        <MeetTheTeam />

        {/* You dream — we embody */}
        <GetMoreWithUs />

        {/* What people Say */}
        <WhatPeopleSay />

        {/* Pricing */}
        {/* <Pricing /> */}

        {/* Latest blog posts */}
        <LatestBlogPosts />

        {/* Contact information */}
        <ContactInformation />

        {/* Contact Form */}
        <ContactForm  />

        {/* Bottom Banner
        <section className="section section-fluid"><a className="section-banner" href="https://www.templatemonster.com/intense-multipurpose-html-template.html" style="background-image: url(images/banner/banner-bg-01-1920x310.jpg); background-image: -webkit-image-set( url(images/banner/banner-bg-01-1920x310.jpg) 1x, url(images/banner/banner-bg-01-3840x620.jpg) 2x )" target="_blank"><img src="images/banner/banner-fg-01-1600x310.png" srcset="images/banner/banner-fg-01-1600x310.png 1x, images/banner/banner-fg-01-3200x620.png 2x" alt="" width="1600" height="310"></a></section> */}


        {/* RD Google Map */}
        <RDGoogleMap />

        {/* Page Footer */}
        <Footer />
      </div>
    </>
  )
}

export default Home;
