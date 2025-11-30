import React from 'react';
import { IconArrowLeft, IconPhone, IconWhatsApp, IconMapPin, IconShieldCheck, IconTrophy, IconBriefcase, IconCheck } from '../components/Icons';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

const Contact: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-slate-800">
      <SEO 
        title="Contact Us - Rajendranagar.online" 
        description="Get in touch with Rajendra Nagar's most trusted real estate platform. Zero brokerage property listing and buying support."
      />
      
      <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-8 text-sm">
        <IconArrowLeft /> Back
      </Link>

      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              Have questions about a property? Want to list your own property in Rajendra Nagar? 
              Reach out to us directly. We are here to assist you with all your real estate needs 
              in Kismatpur, Budvel, Attapur, and surrounding areas.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <IconPhone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Phone Support</h3>
                  <p className="text-slate-600 mb-1">Mon-Sat from 9am to 6pm</p>
                  <a href="tel:+916281256601" className="text-lg font-bold hover:text-blue-600 transition-colors">
                    Click to Call
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-50 p-3 rounded-full text-green-600">
                  <IconWhatsApp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">WhatsApp Chat</h3>
                  <p className="text-slate-600 mb-1">Instant Messaging</p>
                  <a 
                    href="https://wa.me/916281256601"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-lg font-bold hover:text-green-600 transition-colors"
                  >
                    Click to Chat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="bg-gray-50 p-3 rounded-full text-slate-600">
                  <IconMapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Service Area</h3>
                  <p className="text-slate-600">
                    Serving Rajendra Nagar, Kismatpur, Budvel, Attapur<br/>
                    Hyderabad, Telangana
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-xl font-bold mb-4">Send a message</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Currently, the fastest way to reach us is via WhatsApp or Phone. 
              Please use the buttons above for immediate assistance regarding buying or selling.
            </p>
            <div className="flex flex-col gap-3">
              <a 
                href="https://wa.me/916281256601"
                className="block w-full text-center bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                Open WhatsApp
              </a>
              <a 
                href="tel:+916281256601"
                className="block w-full text-center bg-white border border-gray-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* SEO FAQ Content with Trust Factors */}
        <div className="prose prose-slate">
          
          <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100 mb-8 not-prose">
            <h4 className="font-bold text-slate-900 mb-3">Why Choose Us?</h4>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <IconCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span><strong>Zero Brokerage:</strong> No commission. Direct connection between buyer and seller.</span>
              </li>
              <li className="flex gap-2">
                <IconShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span><strong>100% Verified:</strong> No public listings. All properties are curated and verified by admins.</span>
              </li>
              <li className="flex gap-2">
                <IconTrophy className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <span><strong>300 Cr+ Sold:</strong> Proven track record of high-value transactions.</span>
              </li>
              <li className="flex gap-2">
                <IconBriefcase className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span><strong>Trusted Clientele:</strong> Preferred by employees from Google, Microsoft, Accenture, Govt Staff, Professors, Lawyers, and NRIs.</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Do you charge brokerage/commission?</h3>
              <p className="text-slate-600 leading-relaxed">
                <strong>No, absolutely not.</strong> We are strictly against the traditional brokerage model where you lose a percentage of your property value. 
                We do NOT charge any commission from buyers or sellers on the deal value.
              </p>
              <p className="text-slate-600 mt-2 leading-relaxed">
                We operate on a <strong>value-driven listing model</strong>. We charge a nominal fee for listing and verifying your property on our platform. 
                This fee ensures that we can maintain a spam-free, verified marketplace and provide you with genuine leads. Once connected, 
                the buyer and seller deal directly. No hidden charges. No percentage cuts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Why choose Rajendranagar.online?</h3>
              <p className="text-slate-600 leading-relaxed">
                We specialize exclusively in the Rajendra Nagar mandal and its surrounding localities. 
                This local expertise allows us to provide verified information, accurate market valuations, 
                and the best deals in areas like Kismatpur, Bandlaguda Jagir, and Budvel. Unlike generic property portals, 
                we focus on the specific needs of buyers and sellers in South Hyderabad.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can you help with property documentation?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes. Property documentation is a critical part of buying real estate in India. While we are not a legal firm, 
                we can guide you through the process of verifying link documents, encumbrance certificates (EC), 
                and checking HMDA/GHMC approvals to ensure a safe transaction. We strongly recommend all buyers 
                to get a legal opinion before purchase.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">What areas do you cover?</h3>
              <p className="text-slate-600 mb-2">Our primary focus areas include:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Kismatpur & Bandlaguda:</strong> Premium villas and gated communities.</li>
                <li><strong>Budvel:</strong> Open plots and future IT corridor investments.</li>
                <li><strong>Attapur & Hyderguda:</strong> Residential apartments and commercial spaces.</li>
                <li><strong>Gagan Pahad, Satamrai & Kattedan:</strong> Commercial lands and warehouses.</li>
                <li><strong>Shamshabad & Airport Road:</strong> Investment plots near the airport.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">How do I list my property?</h3>
              <p className="text-slate-600 leading-relaxed">
                Listing with us is simple. If you are an owner in Rajendra Nagar, contact us via WhatsApp with your property details, 
                photos, and location pin. Our team will verify the details and list it on our platform to reach thousands of potential buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;