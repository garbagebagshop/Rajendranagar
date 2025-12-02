
import React from 'react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { IconArrowLeft, IconMapPin, IconCheck } from '../components/Icons';
import { Area } from '../types';

const RajendraNagarInfo: React.FC = () => {
  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "Rajendra Nagar",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500030",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.3297,
      "longitude": 78.4124
    },
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": "Ranga Reddy District"
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans text-slate-800">
      <SEO 
        title="Rajendra Nagar, Hyderabad — Complete Guide, Map, Property & Local Info"
        description="Explore Rajendra Nagar (Hyderabad, Telangana): history, amenities, schools, hospitals, transport, real-estate, pin codes and more. Your detailed guide to living & buying property in Rajendra Nagar."
        schema={seoSchema}
      />
      
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium">
          <IconArrowLeft /> Back to Home
        </Link>
      </div>

      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Rajendra Nagar, Hyderabad</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          The comprehensive guide to Rajendra Nagar: A rapidly developing educational, residential, and IT hub in South Hyderabad.
        </p>
      </header>

      {/* Key Facts Table */}
      <section className="mb-12 bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <IconMapPin className="text-blue-600" /> Key Facts & Figures
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50 w-1/3">Mandal Name</th>
                <td className="p-3 text-slate-600">Rajendranagar</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">District</th>
                <td className="p-3 text-slate-600">Ranga Reddy</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">State</th>
                <td className="p-3 text-slate-600">Telangana</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">City / Zone</th>
                <td className="p-3 text-slate-600">Greater Hyderabad (GHMC) - South Zone</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">Pin Codes</th>
                <td className="p-3 text-slate-600">500030 (Main), 500048 (Attapur), 500052 (Kattedan)</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">Languages</th>
                <td className="p-3 text-slate-600">Telugu, Urdu, Hindi, English</td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">Vehicle Code</th>
                <td className="p-3 text-slate-600">TS-07, TS-08</td>
              </tr>
              <tr>
                <th className="p-3 font-semibold text-slate-700 bg-gray-50">Time Zone</th>
                <td className="p-3 text-slate-600">IST (UTC +5:30)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Content Sections */}
      <div className="space-y-12">
        
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">History & Origin</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Rajendra Nagar was originally a quiet suburb known for its agricultural landscape. It gained prominence with the establishment of the <strong>Professor Jayashankar Telangana State Agricultural University (PJTSAU)</strong>, formerly AP Agricultural University. The area was named after Dr. Rajendra Prasad, the first President of India, who inaugurated the university.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Historically, the region was part of the Nizam's dominion, evident from the nearby <strong>Himayat Sagar</strong> and <strong>Osman Sagar</strong> lakes, built for flood control and water supply. Today, it has transformed from an institutional area into a bustling residential and commercial corridor connecting the old city to the new IT districts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Geography & Location</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Located in the southern part of Hyderabad, Rajendra Nagar serves as a critical junction. It is bordered by the PVNR Expressway to the East and the Outer Ring Road (ORR) to the West and South.
          </p>
          <ul className="grid md:grid-cols-2 gap-4 text-slate-700 mb-4">
            <li className="flex items-start gap-2"><IconCheck className="w-5 h-5 text-green-500 mt-0.5" /> <strong>North:</strong> Mehdipatnam & Attapur</li>
            <li className="flex items-start gap-2"><IconCheck className="w-5 h-5 text-green-500 mt-0.5" /> <strong>South:</strong> Shamshabad (Airport)</li>
            <li className="flex items-start gap-2"><IconCheck className="w-5 h-5 text-green-500 mt-0.5" /> <strong>East:</strong> NH-44 (Bangalore Highway)</li>
            <li className="flex items-start gap-2"><IconCheck className="w-5 h-5 text-green-500 mt-0.5" /> <strong>West:</strong> Himayat Sagar & Gandipet</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Administration & Governance</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Rajendranagar is both a Revenue Mandal and an Assembly Constituency. It falls under the administration of the <strong>Greater Hyderabad Municipal Corporation (GHMC)</strong>, specifically the Rajendranagar Circle (Circle 11, South Zone).
          </p>
          <p className="text-slate-700 leading-relaxed">
            The area hosts several key government institutions, including the National Institute of Rural Development (NIRD), National Academy of Agricultural Research Management (NAARM), and the National Police Academy (NPA) in nearby Shivrampalli.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Transport & Connectivity</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            One of the biggest USPs of living in Rajendra Nagar is its superior connectivity.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <ul className="space-y-3 text-slate-700">
              <li><strong>PVNR Expressway:</strong> The 11.6km elevated corridor starts near Attapur, providing a 20-minute signal-free drive to the Rajiv Gandhi International Airport (RGIA).</li>
              <li><strong>Outer Ring Road (ORR):</strong> Exit 17 (Himayat Sagar) and Exit 16 (Shamshabad) are easily accessible, connecting residents to Gachibowli and the Financial District in approx. 20-25 minutes.</li>
              <li><strong>Public Transport:</strong> Well-serviced by TSRTC buses connecting to Koti, Afzal Gunj, and Secunderabad.</li>
              <li><strong>Metro:</strong> The nearest metro stations currently are at Lakdikapul or Charminar, though the proposed Airport Metro Express is expected to have stations along the ORR.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Infrastructure & Amenities</h2>
          
          <h3 className="text-lg font-bold text-slate-800 mb-2">Education</h3>
          <p className="text-slate-700 mb-4">
            Known as an educational hub, the area boasts prestigious institutions:
            <br />
            <em>Universities:</em> PJTSAU, NIRD.
            <br />
            <em>Schools:</em> Delhi Public School (DPS), Glendale Academy, TIME School (Bandlaguda), AVM High School.
            <br />
            <em>Colleges:</em> Narayana Junior College, Lords Institute of Engineering.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mb-2">Healthcare</h3>
          <p className="text-slate-700 mb-4">
            Residents have access to quality healthcare without traveling far.
            <br />
            <em>Hospitals:</em> Mythri Hospital (Attapur), Trident Hospital, Premier Hospital. Government health centers are also available in the mandal headquarters.
          </p>

          <h3 className="text-lg font-bold text-slate-800 mb-2">Shopping & Recreation</h3>
          <p className="text-slate-700 mb-4">
            <strong>Mantra Mall</strong> in Attapur is a major shopping destination with a Cinepolis multiplex. Supermarkets like Ratnadeep, Heritage, and More are present in every sub-locality like Kismatpur and Sun City. For nature lovers, the <strong>Nehru Zoological Park</strong> and <strong>Himayat Sagar Viewpoint</strong> are nearby weekend getaways.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Real Estate & Development</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            The real estate market in Rajendra Nagar has witnessed exponential growth due to the saturation of West Hyderabad. It offers a "best of both worlds" scenario: lower pollution levels due to strict conservation zones (GO 111 areas nearby) and high connectivity.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-2">Residential Hotspots</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li><Link href="/area/Kismatpur" className="underline hover:text-blue-600">Kismatpur</Link>: Luxury Villas & Gated Communities</li>
                <li><Link href="/area/Bandlaguda" className="underline hover:text-blue-600">Bandlaguda Jagir</Link>: Premium Apartments</li>
                <li><Link href="/area/Attapur" className="underline hover:text-blue-600">Attapur</Link>: High-rise Commercial/Residential Mix</li>
                <li><Link href="/area/Budvel" className="underline hover:text-blue-600">Budvel</Link>: Open Plots & IT Corridor Investment</li>
              </ul>
            </div>
            <div className="bg-green-50 p-5 rounded-lg border border-green-100">
              <h3 className="font-bold text-green-900 mb-2">Upcoming Developments</h3>
              <p className="text-sm text-green-800">
                The proposed <strong>IT Cluster in Budvel</strong> is the most significant upcoming project, expected to generate thousands of jobs. Road widening projects from Appa Junction to Kismatpur are also underway to handle increased traffic.
              </p>
            </div>
          </div>
          <p className="text-slate-700">
            Property prices here are currently more affordable than Gachibowli or Kokapet, making it an attractive entry point for investors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-gray-100">Useful Info for Residents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
             <div className="p-4 border rounded-lg">
               <strong>Electricity Board:</strong> TSSPDCL (Telangana State Southern Power Distribution Company Ltd).
             </div>
             <div className="p-4 border rounded-lg">
               <strong>Water Supply:</strong> HMWSSB (Manjeera & Krishna water supply in many colonies).
             </div>
             <div className="p-4 border rounded-lg">
               <strong>Police Station:</strong> Rajendranagar PS (Cyberabad Commissionerate).
             </div>
             <div className="p-4 border rounded-lg">
               <strong>Registration Office:</strong> Sub-Registrar Office Rajendranagar (Upperpally).
             </div>
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Is Rajendra Nagar a good place to live?</h3>
              <p className="text-slate-600 text-sm">Yes, it is excellent for families and IT professionals. It offers a peaceful environment with less pollution compared to the core city, yet provides 20-minute access to Hitech City via ORR.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">How far is the Airport from Rajendra Nagar?</h3>
              <p className="text-slate-600 text-sm">Rajendra Nagar is one of the closest residential hubs to RGIA. It takes approximately 15-20 minutes (around 15-18 km) via the PVNR Expressway or NH-44.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">What property types are available in Rajendra Nagar?</h3>
              <p className="text-slate-600 text-sm">The area offers a mix of everything: luxury villas in Kismatpur/Bandlaguda, high-rise apartments in Attapur, and open plots for investment in Budvel and Kattedan.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Does the metro connect to Rajendra Nagar?</h3>
              <p className="text-slate-600 text-sm">Currently, there is no direct metro station. The closest stations are Lakdikapul (Red Line) or Charminar (Green Line). However, the airport bus connectivity is excellent.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default RajendraNagarInfo;
