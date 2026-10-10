export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  photoUrl?: string;
  bio: string[];
}

export interface AdvisoryMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  photoUrl?: string;
}

export const RESEARCH_HERO_DATA = {
  title: "Research and Insights",
  eyebrow: "RESEARCH & INSIGHTS",
  bannerImage: "/images/solutions/research-hero.jpg",
  leadParagraph:
    "At the core of successful wealth management lies robust research capabilities. Our firm prides itself on an extensive and sophisticated research infrastructure designed to deliver superior financial advice and investment strategies.",
  partnershipLead:
    "We partner with one of the most prominent names in the professional research industry famously knows as NGEN Markets.",
  partnerDescription:
    "NGEN Research is a financial technology firm based out of India with offices in Mumbai, New Delhi, Kolkata and London. They provide institutional class Financial Analytics, advanced portfolio analysis and deep-dive security analysis via a cloud based platform. They serve a variety of clients from large banks and asset management companies to individual wealth advisors. The partners come from solid institutional asset management backgrounds and are managing several billions of dollars across top-tier global investment management firms, banks and hedge funds.",
};

export const LEADERSHIP_TEAM_DATA = {
  sectionTitle: "LEADERSHIP TEAM – NGEN RESEARCH",
  eyebrow: "LEADERSHIP TEAM",
  intro:
    "The leadership team at NGEN consists of a unique combination of mutually exclusive skill sets of sales, technology and finance. We have decades of experience at the world's most prestigious investment banks, asset managers and hedge funds including JP Morgan, Morgan Stanley, Credit Suisse and Millennium.",
  members: [
    {
      id: "deb-majumdar",
      name: "Deb Majumdar",
      role: "Founder & Chief Executive Officer",
      initials: "DM",
      photoUrl: "/images/research-insights/deb-majumdar.jpg",
      bio: [
        "Debabrata is a founding member of NGEN. Previously, he was the Head of Wealth Management at Phillip Capital India, Private Client Group. Prior to this, he held various roles at ICRA Online, Edelweiss AMC, Motilal Oswal and IndusInd Bank.",
        "He holds a MBA from the Institute of Technology & Management, Mumbai and an Advanced Marketing Program from Chartered Institute of Marketing, UK. He also completed a Post Graduate Honors Diploma in Systems Management from NIIT, Calcutta and a B.Sc. in Economics from Calcutta University.",
      ],
    },
    {
      id: "arunabh-mukherjee",
      name: "Arunabh Mukherjee",
      role: "Founder & Chief Technology Officer",
      initials: "AM",
      photoUrl: "/images/research-insights/arunabh-mukherjee.jpg",
      bio: [
        "Arunabh is a founding member of NGEN. Previously, he was a portfolio manager of $200 million at Millennium Partners in London. Before Millennium, he was a portfolio manager of over $3 billion in assets at Morgan Stanley Investment Management in London. Arunabh started his financial services career in the FX options trading desk at JP Morgan in London.",
        "Arunabh holds a MSc in Interdisciplinary Mathematics specialising in Artificial Neural Networks from the University of Warwick and a BA with Honours in Mathematics from Delhi University.",
      ],
    },
    {
      id: "neil-chakraborty",
      name: "Neil Chakraborty",
      role: "Founder & Chief Strategy Officer",
      initials: "NC",
      photoUrl: "/images/research-insights/neil-chakraborty.jpg",
      bio: [
        "Neil is a founding member of NGEN Research. He is also a partner at NGEN Capital and works as a Portfolio Manager. Before NGEN Capital he was an Executive Director at Morgan Stanley in London from October 2006 to April 2013.",
        "Prior to Morgan Stanley, Neil was a Vice president at Credit Suisse, where his responsibilities included the allocation of risk capital to hedge funds.",
        "Neil holds an MSc in Mathematics and Finance from Imperial College and an MBA in Finance from the University of British Columbia.",
      ],
    },
  ] as TeamMember[],
};

export const ADVISORY_BOARD_DATA = {
  sectionTitle: "ADVISORY BOARD",
  eyebrow: "ADVISORY COMMITTEE",
  intro:
    "Our advisory committee consists of leaders who have made a lasting impact on the financial services industry and mentored many individuals and companies to success. We are very fortunate to have the benefit of their advice, direction and support.",
  members: [
    {
      id: "suraj-kaeley",
      name: "Suraj Kaeley",
      role: "Ex Group President, UTI Mutual Fund",
      initials: "SK",
      photoUrl: "/images/research-insights/suraj-kaeley.jpg",
    },
    {
      id: "pierre-david-berten",
      name: "Pierre-David Berten",
      role: "UK Director, Credit Suisse",
      initials: "PB",
      photoUrl: "/images/research-insights/pierre-david-berten.jpg",
    },
    {
      id: "anil-nahar",
      name: "Anil Nahar",
      role: "Regis & Savoy",
      initials: "AN",
      photoUrl: "/images/research-insights/anil-nahar.jpg",
    },
    {
      id: "v-ramesh",
      name: "V. Ramesh",
      role: "MD & CEO, MF Utilities Ltd",
      initials: "VR",
      photoUrl: "/images/research-insights/v-ramesh.jpg",
    },
    {
      id: "rajan-krishnan",
      name: "Rajan Krishnan",
      role: "Ex CEO, Baroda Pioneer Mutual Funds",
      initials: "RK",
      photoUrl: "/images/research-insights/rajan-krishnan.jpg",
    },
    {
      id: "sanjeev-kumar",
      name: "Sanjeev Kumar",
      role: "Ex National Head of Retail, SREI",
      initials: "SK",
      photoUrl: "/images/research-insights/sanjeev-kumar.jpg",
    },
  ] as AdvisoryMember[],
};
