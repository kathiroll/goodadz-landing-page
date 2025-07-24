import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

export default function GoodAdsLandingPage() {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("businesses");
  const [waitlistTab, setWaitlistTab] = useState("advertisers");
  const [status, setStatus] = useState("Initializing...");

  // Widget control functions
  const showWidget = () => {
    if (window.GoodAdz && window.GoodAdz.show) {
      window.GoodAdz.show();
      updateStatus('Widget shown');
    } else {
      updateStatus('Error: Widget not ready yet');
    }
  };

  const hideWidget = () => {
    if (window.GoodAdz && window.GoodAdz.hide) {
      window.GoodAdz.hide();
      updateStatus('Widget hidden');
    } else {
      updateStatus('Error: Widget not ready yet');
    }
  };

  const getStatus = () => {
    if (window.GoodAdz && window.GoodAdz.getStatus) {
      const status = window.GoodAdz.getStatus();
      updateStatus(`Status: ${JSON.stringify(status, null, 2)}`);
    } else {
      updateStatus('Error: Widget not ready yet');
    }
  };

  const enableAutoShow = () => {
    if (window.GoodAdz && window.GoodAdz.updateConfig) {
      window.GoodAdz.updateConfig({
        autoShow: true,
        showDelay: 3000
      });
      updateStatus('Auto-show enabled (3 seconds)');
    } else {
      updateStatus('Error: Widget not ready yet');
    }
  };

  const updateStatus = (message) => {
    setStatus(`${new Date().toLocaleTimeString()}: ${message}`);
  };

  // Check if widget is loaded
  const checkWidgetStatus = () => {
    if (window.GoodAdz && window.GoodAdz.initialized) {
      updateStatus('Widget loaded and ready to use');
    } else {
      updateStatus('Waiting for widget to load...');
      setTimeout(checkWidgetStatus, 500);
    }
  };

  // Configuration for the widget
  useEffect(() => {
    window.GoodAdzConfig = {
      onReady: function() {
        updateStatus('Widget initialized and ready!');
      },
      onClose: function() {
        updateStatus('Widget closed by user');
      }
    };

    // Start checking when component mounts
    checkWidgetStatus();
  }, []);

  // Load the widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://forked.co.in/dist/ad-widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GoodAds
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  How it Works
                </a>
                <a href="#demo" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Demo
                </a>
                <a href="#waitlist" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Join Waitlist
                </a>
              </div>
            </div>
            <div className="md:hidden">
              <Button variant="outline" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            {/* <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Revolutionizing Digital Advertising
            </div> */}
            
            {/* Tagline */}
            <p className="text-lg md:text-xl text-gray-500 mb-4 font-light italic">
              I know this might sound weird. Scary also perhaps. But imagine
            </p>
            
            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Good Ads
              </span>
            </h1>
            
            {/* Subheadline */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 leading-tight">
              Ads. But Good. For Everyone.
            </h2>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ethical advertising that puts users first. Intent-driven impressions and valuable data collection to supercharge business decisions. A simple plugin for websites to start generating revenue.{" "}
              <span className="font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                A better ad experience - for everyone.
              </span>
            </p>
            
            {/* Social Proof */}
            {/* <div className="flex items-center justify-center space-x-8 mb-10 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                  ))}
                </div>
                <span>500+ websites trust us</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-semibold mr-1">✓</span>
                <span>GDPR Compliant</span>
              </div>
            </div> */}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300">
                Get Early Access
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Why We're Good For You Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 my-20 rounded-3xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Imagine an ad provider for websites that's also a microdata aggregation platform. Here's why we're good for you:
            </h2>
            <p className="text-lg text-purple-200 italic">
              (this is going to be lengthy. we really are that good)
            </p>
          </div>
          
          {/* Interactive Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => setActiveTab('businesses')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'businesses' 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-2xl' 
                  : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>For Businesses</span>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('websites')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'websites' 
                  ? 'bg-gradient-to-r from-green-400 to-teal-500 text-gray-900 shadow-2xl' 
                  : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
                <span>For Websites</span>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-gray-900 shadow-2xl' 
                  : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>For Users</span>
              </div>
            </button>
          </div>
          
          {/* Content Display */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'businesses' && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">The Problem with Ads Today</h3>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">Banner Blindness</h4>
                      <p className="text-purple-200">Research shows that users completely ignore anything that even looks like an ad, even if it contains relevant information. <a href="https://journals.sagepub.com/doi/abs/10.1177/154193129804200504" className="text-yellow-400 hover:text-yellow-300 underline">Source</a></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">The Skip & Ignore Cycle</h4>
                      <p className="text-purple-200">Every time a user skips an ad, they reinforce the behavior and wire themselves to skip the next ad even more. On the other hand, during unskippable ads, users engage in other activities like checking their phones/switching tabs etc. <a href="https://www.researchgate.net/publication/361052044_I_hate_ads_but_not_the_advertised_brands_A_qualitative_study_on_Internet_users'_lived_experiences_with_YouTube_ads" className="text-yellow-400 hover:text-yellow-300 underline">Source</a></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg">The User Survey Gap</h4>
                      <p className="text-purple-200">The success of a company rests on understanding their consumer. Feedback from users is paramount to understanding user needs, yet no easy and effective option exists today to gather this crucial information.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl p-6 mb-8 border border-yellow-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">Here's How We're Reshaping Ads</h3>
                  <p className="text-purple-200 text-center text-lg leading-relaxed">
                    Instead of a traditional ad, imagine if users were made to choose their ad and answer up to 3 questions for every ad. So, all your business needs - whether it's idea validation, deciding pricing, A/B testing, or even just gathering feedback for your ad campaigns - all of them can get answered by the only people AI cannot replace: <span className="text-yellow-400 font-semibold">actual people</span>.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Ethical & Compliant</h4>
                        <p className="text-purple-200">Fully compliant with all GDPR/CCPA principles, ensuring your advertising practices meet the highest ethical standards.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Reach Your Ideal Target Audience</h4>
                        <p className="text-purple-200">Instead of shelling out money relying on other companies' analysis of what your ideal customer should be, let the users who are actually interested in your product come to you.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Authentic Feedback</h4>
                        <p className="text-purple-200">Get data from real people who clicked on your ad because they were genuinely interested in what you offer.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Pay for Data, Not Views</h4>
                        <p className="text-purple-200">Get the most meaningful impressions you can get for free. Pay for the valuable data collected, not wasted impressions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'websites' && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Monetize Without Compromise</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">We Accept (almost) All Websites</h4>
                        <p className="text-purple-200">Traditional ad networks have many restrictions when it comes to accepting websites. Minimum traffic requirements (including whether traffic is coming from Tier-1 countries), niche preferences, original content requirements - the list goes on. Whether you're a high traffic website, a recently launched saas product, or just a kitchen blog, we can help you all.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Simple And Safe</h4>
                        <p className="text-purple-200">No complex configurations or technical expertise required. One plugin. one setup. Zero worries.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Higher Revenue Potential</h4>
                        <p className="text-purple-200">Intent-driven ads convert better, and companies pay more to collect user submitted insights. This lets us offer significantly (like, really significantly) higher CPMs than traditional ad networks.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Your Users Deserve a Better Ad Experience</h4>
                        <p className="text-purple-200">Traditional ads are unimpactful for businesses, and annoying and distracting for users. By letting users choose their ad, we offer businesses a more valuable ad experience, and users a better uninterrupted experience after watching the ad.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 animate-fade-in">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Take Control of Your Experience</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Privacy First</h4>
                        <p className="text-purple-200">This foundational idea this company was born out of was exactly this - wanting ads that respect our privacy. No user data is tracked, collected or bought apart from whatever the user provides intentionally.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Choose Your Ads</h4>
                        <p className="text-purple-200">Since we don't buy your data, we technically don't know what to recommend you. This allows you to choose whatever ad you want to watch.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">A Better Ad Experience</h4>
                        <p className="text-purple-200">User problems with ads include privacy concerns, length, repetition, and distracting/worse UX for websites with banner ads. <a href="https://eprints.whiterose.ac.uk/id/eprint/187586/1/IntR_YouTubeAds_PURE.pdf" className="text-yellow-400 hover:text-yellow-300 underline">Research shows</a> these issues. We try to fix that.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-gray-900 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">Support Your Favorite Sites</h4>
                        <p className="text-purple-200">Help websites you love stay free while only seeing content that's actually useful to you.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your advertising experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Advertisers</h3>
                <ul className="text-gray-600 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Only pay for insights, not impressions
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Users opt-in and choose your ad
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    GDPR-compliant & transparent
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Websites</h3>
                <ul className="text-gray-600 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    No traffic or content constraints
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    New monetization path
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Simple plugin integration
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Users</h3>
                <ul className="text-gray-600 space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Pick the ad you want to see
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    One-time per session
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    No tracking or targeting
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Of my friends support this (one didnt understand)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
              <div className="text-gray-600">Higher Conversion (possible)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Privacy Compliant (true)</div>
            </div>
          </div>
        </div>
      </section>


      {/* Demo Video */}
      <section id="demo" className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              See It in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how users interact with ads they actually want to see
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-2xl flex items-center justify-center mb-8 overflow-hidden">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg">Demo Video Coming Soon</p>
                </div>
              </div>
              
              {/* Widget Control Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button 
                  onClick={showWidget}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Show Ad Widget
                </Button>
                <Button 
                  onClick={hideWidget}
                  variant="outline"
                  size="lg" 
                  className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Hide Widget
                </Button>
                <Button 
                  onClick={enableAutoShow}
                  variant="outline"
                  size="lg" 
                  className="border-2 border-gray-300 hover:border-green-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Enable Auto-Show
                </Button>
              </div>
              
              {/* Status Display */}
              <div className="bg-white rounded-lg p-4 shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Widget Status:</h3>
                <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
                  {status}
                </p>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get This on My Site
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture */}
      <section id="waitlist" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the Waitlist
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be among the first to experience the future of ethical advertising
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <Tabs value={waitlistTab} onValueChange={setWaitlistTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="advertisers" className="text-sm font-medium">
                      For Advertisers
                    </TabsTrigger>
                    <TabsTrigger value="websites" className="text-sm font-medium">
                      For Websites
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="advertisers" className="space-y-4">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          placeholder="Full Name" 
                        />
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          placeholder="Email Address" 
                          type="email"
                        />
                      </div>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="Company Name" 
                      />
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <option>Select Budget Range</option>
                        <option>&lt;$1k</option>
                        <option>$1k–$10k</option>
                        <option>$10k+</option>
                      </select>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="Industry" 
                      />
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Join as Advertiser
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="websites" className="space-y-4">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          placeholder="Full Name" 
                        />
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                          placeholder="Email Address" 
                          type="email"
                        />
                      </div>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="Website URL" 
                      />
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="Monthly Traffic (optional)" 
                      />
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="Platform (WordPress, etc.)" 
                      />
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Join as Website
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Be Part of a Better Ad Future?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of websites and advertisers who are already transforming their digital advertising experience.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Get Early Access Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              GoodAds
            </h3>
            <p className="text-gray-400 mb-6">
              Ethical advertising for a better web
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 