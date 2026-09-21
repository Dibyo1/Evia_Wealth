export interface OfficeInfo {
  id: string;
  name: string;
  suiteTitle: string;
  address: string;
  phone: string;
  email: string;
  coordinates: [number, number]; // [lng, lat]
}

export const OFFICES_DATA: OfficeInfo[] = [
  {
    id: "kolkata",
    name: "Kolkata",
    suiteTitle: "KOLKATA ADVISORY SUITE",
    address: "Unit 521, 5th Floor, Regus Offices, Salt Lake Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    phone: "+91 22 6912 0000",
    email: "advisory@eviawealth.com",
    coordinates: [88.419, 22.576],
  },
  {
    id: "delhi",
    name: "Delhi NCR",
    suiteTitle: "DELHI NCR ADVISORY SUITE",
    address: "DLF Cyber City, Tower B, Level 12, Gurugram, Haryana 122002",
    phone: "+91 22 6912 0000",
    email: "advisory@eviawealth.com",
    coordinates: [77.089, 28.495],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    suiteTitle: "MUMBAI ADVISORY SUITE",
    address: "One BKC, C-Wing, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    phone: "+91 22 6912 0000",
    email: "advisory@eviawealth.com",
    coordinates: [72.868, 19.066],
  },
  {
    id: "pune",
    name: "Pune",
    suiteTitle: "PUNE ADVISORY SUITE",
    address: "ICC Trade Tower, Senapati Bapat Road, Pune, Maharashtra 411016",
    phone: "+91 22 6912 0000",
    email: "advisory@eviawealth.com",
    coordinates: [73.834, 18.531],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    suiteTitle: "HYDERABAD ADVISORY SUITE",
    address: "Salarpuria Sattva Knowledge City, HITEC City, Hyderabad, Telangana 500081",
    phone: "+91 22 6912 0000",
    email: "advisory@eviawealth.com",
    coordinates: [78.377, 17.438],
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    suiteTitle: "BENGALURU ADVISORY SUITE",
    address: "UB City, Concorde Block, Vittal Mallya Road, Bengaluru, Karnataka 560001",
    phone: "+91 22 6912 0000",
    email: "advisory@eviawealth.com",
    coordinates: [77.596, 12.971],
  },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  fullRole: string;
  avatar: string;
  bio: string;
  facts: {
    label: string;
    value: string;
  }[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "punit-sharma",
    name: "Mr. Punit Sharma",
    role: "Managing Director",
    fullRole: "Managing Director & Co-founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    bio: "Mr Punit Sharma is the Managing Director and co founder at Evia. Academically he is an MBA from IBS Hyderabad and also holds professional certifications and training in wealth management, banking and advisory from NISM and IIBF. He also holds an International level certification from CISI, U.K with specialisation in the field of Investment, Risk and Taxation. He has held senior positions like Group Head and Regional Head with major organisations like Bank of Baroda, ICICI Bank and Tata Capital. His passion for wealth management and client relationship management has led him to be one of the most sought after private bankers in the city of joy, Kolkata. With an exposure to significant players in the PSU, Private, Foreign and NBFC wealth & banking space, he has a well rounded exposure and in depth understanding of the entire eco system present in the country. He is an avid sports follower and his recent interests include astrophysics.",
    facts: [
      { label: "Experience in wealth & banking", value: "16+ Years" },
      { label: "Academic credentials", value: "MBA (IBS Hyderabad)" },
      { label: "Global certification", value: "CISI (U.K.) - Investment, Risk & Tax" },
      { label: "Leadership pedigree", value: "Ex-Group Head, ICICI, BoB & Tata Capital" },
    ],
  },
  {
    id: "bikash-nath",
    name: "Mr. Bikash Kumar Nath",
    role: "Director",
    fullRole: "Director & Co-founder",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    bio: "Mr Bikash Kumar Nath is the CO-Founder and Director at Evia. A PGCBM from NMIMS, Mumbai he brings with him over 14 years of expertise into wealth management and banking. During his previous assignments as a Wealth Strategist he has been instrumental in driving growth and financial freedom for individuals and organizations across different age groups and diverse portfolio sizes. He is highly passionate about promoting the essence of informed investment decisions for long term wealth creation. At Evia he spearheads innovative strategies and educational initiatives.",
    facts: [
      { label: "Experience managing wealth", value: "14+ Years" },
      { label: "Management education", value: "PGCBM (NMIMS, Mumbai)" },
      { label: "Institutional track record", value: "Wealth Strategist across diverse portfolios" },
      { label: "Currently spearheads", value: "Innovative Strategies & Investor Initiatives" },
    ],
  },
  {
    id: "debnarayan-dey",
    name: "Mr. Debnarayan Dey",
    role: "Director",
    fullRole: "Director & Co-founder",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    bio: "Mr. Debnarayan Dey is the Co-founder and Director at Evia. He has an exhaustive market & industry experience of over 13 years in the domains of Premium Banking and Investment advisory. He has also held leadership positions across PSU banks and Wealth based NBFC organisations and has successfully driven key management strategies. He is passionate about providing holistic financial solutions that meet the diverse and evolving needs of HNI and UHNIs. His mantra for model portfolio remains lucid and that is one that fosters a long term mutually beneficial client relationship. At Evia, he spearheads the key portfolio of products and research with a vision to make the organisation one of the most trusted brands in the field of research and advisory in our country.",
    facts: [
      { label: "Experience in premium advisory", value: "13+ Years" },
      { label: "Banking & NBFC background", value: "Leadership at PSU Banks & Wealth NBFCs" },
      { label: "Client focus", value: "Holistic solutions for HNIs & UHNIs" },
      { label: "Currently spearheads", value: "Products, Advisory & Quant Research" },
    ],
  },
];

export interface ClientPartner {
  id: string;
  name: string;
  role: string;
  image: string;
  bullets: string[];
}

export const CLIENT_PARTNERS: ClientPartner[] = [
  {
    id: "1",
    name: "Jigme Bhutia",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "Founder of one of the largest healthcare chains",
      "CEO of well known multi-national company",
      "Founder of India's well-known unicorn",
    ],
  },
  {
    id: "2",
    name: "Bhuvanesh Kumar",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "Promoter of a listed pharmaceutical company",
      "Promoter of a well-known real estate company",
      "Founder of one of the largest cloud kitchen brands",
    ],
  },
  {
    id: "3",
    name: "Abhishek Arora",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "Founder of the leading mobile gaming platform in India",
      "Founder of the largest B2B tech platform in India",
      "CEO of the largest omni-channel jewellery brand",
    ],
  },
  {
    id: "4",
    name: "Neha Kaul",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "Promoter of one of India's heritage confectionery brands",
      "Founder of premier IB schools in India",
      "Promoter & corporate account of large spice brand in India",
    ],
  },
  {
    id: "5",
    name: "Jitender Mehta",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "Founder of a prominent health tech company",
      "Head of Strategy — India with a leading technology company",
      "CTO — India with a valuable US accounting company",
    ],
  },
  {
    id: "6",
    name: "Pranav Nagar",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "India MD of a large private equity fund",
      "Retired global CFO of a listed packaging company",
      "Reputed doctors and owners of a pediatric hospital",
    ],
  },
  {
    id: "7",
    name: "Harshvardhan Chauhan",
    role: "Client Partner",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
    bullets: [
      "Promoter of India's leading listed consumer brand",
      "MD for a leading multinational media company",
      "Founder of India's leading premium beauty brand",
    ],
  },
];

export interface InsightArticle {
  id: string;
  category: string;
  title: string;
  caption?: string;
  readTime: string;
  image: string;
}

export const INSIGHTS_ARTICLES: InsightArticle[] = [
  {
    id: "article-1",
    category: "WEALTH CREATION",
    title: "Just salary is not enough to create wealth",
    caption: "Ft. Mukund Kalasakaran (Chief Business Officer)",
    readTime: "6 min watch",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "article-2",
    category: "MACRO TRENDS",
    title: "The financial and business impact of festive sales on e-commerce giants in India",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "article-3",
    category: "ALTERNATIVE ASSETS",
    title: "How are the affluent investing in fine art and alternative collectibles?",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
  },
];
