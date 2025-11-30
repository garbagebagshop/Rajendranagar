import React from 'react';
import { Area } from '../types';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { IconArrowLeft } from '../components/Icons';

const Sitemap: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SEO 
        title="Sitemap - Rajendranagar.online" 
        description="Navigate through all areas and pages on Rajendranagar.online."
      />
      
      <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-8 text-sm">
        <IconArrowLeft /> Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-8">Sitemap</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Main Pages</h2>
          <ul className="space-y-2 text-blue-600">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Areas & Localities</h2>
          <ul className="space-y-2 text-blue-600">
            {Object.values(Area).map(area => (
              <li key={area}>
                <Link href={`/area/${encodeURIComponent(area)}`} className="hover:underline">
                  Properties in {area}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
