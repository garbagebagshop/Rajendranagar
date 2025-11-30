import React from 'react';
import { IconArrowLeft } from '../components/Icons';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-slate-800">
      <SEO 
        title="Terms & Conditions - Rajendranagar.online" 
        description="Terms of Service and Disclaimer for Rajendranagar.online."
      />
      
      <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-8 text-sm">
        <IconArrowLeft /> Back
      </Link>

      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

      <div className="prose prose-slate max-w-none space-y-8 text-justify">
        <p className="text-sm text-slate-500">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
          <p>
            Welcome to <strong>rajendranagar.online</strong>! These terms and conditions outline the rules and regulations for the use of our Website.
            By accessing this website we assume you accept these terms and conditions. Do not continue to use rajendranagar.online if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Terminology</h2>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of India. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Cookies</h2>
          <p>
            We employ the use of cookies. By accessing rajendranagar.online, you agreed to use cookies in agreement with the rajendranagar.online's Privacy Policy.
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. License</h2>
          <p>
            Unless otherwise stated, rajendranagar.online and/or its licensors own the intellectual property rights for all material on rajendranagar.online. All intellectual property rights are reserved. You may access this from rajendranagar.online for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p className="font-semibold mt-2">You must not:</p>
          <ul className="list-disc pl-5">
            <li>Republish material from rajendranagar.online</li>
            <li>Sell, rent or sub-license material from rajendranagar.online</li>
            <li>Reproduce, duplicate or copy material from rajendranagar.online</li>
            <li>Redistribute content from rajendranagar.online</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. User Comments & Liability</h2>
          <p>
            Certain parts of this website offer the opportunity for users to post and exchange opinions and information in certain areas of the website. rajendranagar.online does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of rajendranagar.online,its representatives and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, rajendranagar.online shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.
          </p>
          <p>
            rajendranagar.online reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Property Listings and Accuracy</h2>
          <p>
            The materials appearing on rajendranagar.online could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice. However, we do not make any commitment to update the materials.
          </p>
          <p>
            <strong>Real Estate Disclaimer:</strong> All property information provided on this website is for informational purposes only. Prices, availability, and property details are subject to change without notice. We strongly recommend that you independently verify all information, including property titles, dimensions, and legal approvals (HMDA/GHMC), before making any financial decisions. rajendranagar.online is not responsible for any financial loss or damages resulting from reliance on the information provided herein.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Hyperlinking to our Content</h2>
          <p>
            The following organizations may link to our Website without prior written approval:
          </p>
          <ul className="list-disc pl-5">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
            <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in Hyderabad, Telangana state for any disputes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;