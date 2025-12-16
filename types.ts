
export enum Area {
  AirportRoad = "Airport Road",
  AppalappaGuda = "Appalappa Guda",
  ArshMahalRoad = "Arsh Mahal Road",
  Attapur = "Attapur",
  Bairagiguda = "Bairagiguda",
  BandlagudaJagir = "Bandlaguda Jagir",
  Budvel = "Budvel",
  Gaganpahad = "Gaganpahad",
  Gandamguda = "Gandamguda",
  Gandipet = "Gandipet",
  Gungurthy = "Gungurthy",
  HanumanNagar = "Hanuman Nagar",
  Himayathsagar = "Himayathsagar",
  Hydershakot = "Hydershakot",
  Janibegum = "Janibegum",
  Kattedan = "Kattedan",
  Khanapur = "Khanapur",
  KhayyamNagar = "Khayyam Nagar",
  Kismatpur = "Kismatpur",
  Kokapet = "Kokapet",
  Lakshmiguda = "Lakshmiguda",
  ManasaHills = "Manasa Hills",
  Manchirevula = "Manchirevula",
  ManikondaJagir = "Manikonda Jagir",
  ManikondaKhalsa = "Manikonda Khalsa",
  MaqthaKousarali = "Maqtha Kousarali",
  Narsingi = "Narsingi",
  Neknampur = "Neknampur",
  Pallecheru = "Pallecheru",
  PanjashajamalBowli = "Panjashajamal Bowli",
  Peeramcheru = "Peeramcheru",
  Pokkalwada = "Pokkalwada",
  Premavathipet = "Premavathipet",
  Puppalguda = "Puppalguda",
  Rajendranagar = "Rajendranagar",
  Satamrai = "Satamrai",
  Sikanderguda = "Sikanderguda",
  Sivarampalli = "Sivarampalli",
  Sogbowli = "Sogbowli",
  SunCity = "Sun City",
  TeachersColony = "Teachers Colony",
  Upparpally = "Upparpally",
  Vattinagulapalle = "Vattinagulapalle"
}

export enum PropertyType {
  Villa = "Villa",
  Apartment = "Apartment",
  IndependentHouse = "Independent House",
  OpenPlot = "Open Plot"
}

export enum ListingCategory {
  Sale = "Sale",
  Rent = "Rent"
}

export enum SizeUnit {
  SqFt = "Sq Ft",
  SqYd = "Sq Yd",
  Gaj = "Gaj"
}

export enum ContactType {
  Default = "default",
  Custom = "custom"
}

export interface PropertyData {
  title: string;
  area: Area;
  propertyType: PropertyType;
  listingCategory: ListingCategory;
  size: {
    value: number;
    unit: SizeUnit;
  };
  price: number;
  facing: string;
  description: string;
  amenities: string[];
  location: {
    googleMapsLink: string;
  };
  media: {
    youtubeLink?: string;
    images: string[]; // Base64 encoded WebP strings
  };
  contact: {
    type: ContactType;
    name?: string;
    phone?: string;
    whatsapp?: string;
  };
}

export interface Property extends PropertyData {
  id: string;
  created_at: string;
  featured?: string;
}

export const AMENITIES_LIST = [
  "Gated Community",
  "24/7 Security",
  "Water Supply",
  "Power Backup",
  "Car Parking",
  "Lift",
  "Club House",
  "Swimming Pool",
  "Gym",
  "Park / Garden",
  "Vastu Compliant"
];

// --- Admin Types ---

export interface UserLimit {
  mobile: string;
  max_posts: number;
  tier_name: string;
  updated_at?: string;
}

export interface DashboardStats {
  totalAds: number;
  todaysAds: number;
  topAreas: { area: string; count: number }[];
}

export const TIER_PLANS = [
  { name: 'Free', limit: 1 },
  { name: 'Iron', limit: 5 },
  { name: 'Steel', limit: 10 },
  { name: 'Copper', limit: 15 },
  { name: 'Silver', limit: 20 },
  { name: 'Gold', limit: 25 },
];
