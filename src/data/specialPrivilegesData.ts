export interface ConciergeSubCard {
  id: string;
  partner: string;
  caption: string;
  image: string;
  alt: string;
}

export interface PrivilegeSection {
  id: string;
  sectionNumber: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition: "left" | "right";
  isWhiteContainer?: boolean;
  isConciergeCard?: boolean;
  subtitle?: string;
  subCards?: ConciergeSubCard[];
}

export const SPECIAL_PRIVILEGES_DATA = {
  eyebrow: "SPECIAL PRIVILEGES",
  heading: "Special Privileges",
  subheading:
    "At EVIA Wealth, we believe in providing our clients with unparalleled service and exclusive benefits that go beyond traditional wealth management. Our special privileges are designed to offer a holistic and enriched experience, ensuring that our clients enjoy the utmost convenience, luxury, and opportunities.",
  sections: [
    {
      id: "exclusive-events",
      sectionNumber: "01",
      tag: "NETWORKING & ACCESS",
      title: "Invitations to Exclusive Events",
      description:
        "Receive invitations to exclusive events, including private seminars, investment forums, and social gatherings. These events offer opportunities to network with industry leaders, gain insights from renowned experts, and enjoy exclusive experiences tailored to your interests.",
      image: "/images/special-privileges/event.jpg",
      alt: "Wealth Management Leadership Forum panel discussion",
      imagePosition: "right" as const,
      isWhiteContainer: false,
    },
    {
      id: "security-privacy",
      sectionNumber: "02",
      tag: "INSTITUTIONAL GRADE",
      title: "Enhanced Security and Privacy",
      description:
        "Your security and privacy are our top priorities. We employ advanced security measures and protocols to protect your sensitive information and ensure that your financial dealings remain confidential and secure. We partner with NSE (National Stock Exchange) and Excel Net Solutions Private Limited, commonly known as Investwell, for securing your financial data and providing ease of financial transactions.",
      image: "/images/special-privileges/security.jpg",
      alt: "Data security",
      imagePosition: "left" as const,
      isWhiteContainer: false,
    },
    {
      id: "concierge-services",
      sectionNumber: "03",
      tag: "LUXURY TRANSIT",
      title: "Concierge Services",
      subtitle: "Exclusive Airport Pick up and Drop facility",
      description: "",
      image: "/images/special-privileges/concierge-bg.jpg",
      alt: "Concierge Services",
      imagePosition: "right" as const,
      isConciergeCard: true,
      subCards: [
        {
          id: "fabcars",
          partner: "FAB CARS",
          caption:
            "Get Complementary Domestic Pick up and Drop Service as a Premium Evia Wealth Client. The facility is provided by renowned partners like FAB CARS who are a professional chauffeur service in India.",
          image: "/images/special-privileges/fabcars.jpg",
          alt: "FabCars logo",
        },
        {
          id: "blacklane",
          partner: "BLACKLANE",
          caption:
            'Get International Airport pick up and drop service from Blacklane "Global Chauffeur Service". For details, terms and conditions please connect with your relationship manager.',
          image: "/images/special-privileges/blacklane.jpg",
          alt: "Blacklane logo",
        },
      ],
    },
    {
      id: "reporting-insights",
      sectionNumber: "04",
      tag: "PORTFOLIO INTELLIGENCE",
      title: "Comprehensive Reporting and Insights",
      description:
        "Stay informed with comprehensive reporting and insights into your investments and financial performance. Our detailed reports and regular updates ensure that you have a clear and accurate understanding of your financial status, empowering you to make informed decisions.",
      image: "/images/special-privileges/portfolio-makeup.jpg",
      alt: "Portfolio make-up allocation chart",
      imagePosition: "right" as const,
      isWhiteContainer: true,
    },
    {
      id: "courier-services",
      sectionNumber: "05",
      tag: "GLOBAL DOCUMENT LOGISTICS",
      title: "Domestic and International Courier Services",
      description:
        "We understand that wealth transcends all boundaries and many of our clients will require both domestic and international courier facilities to assist them in completing their important financial investments. We therefore partner with DTDC and DHL for enabling transfer of important financial documents. For details, please get in touch with your relationship manager.",
      image: "/images/special-privileges/courier.jpg",
      alt: "DHL and DTDC logos",
      imagePosition: "left" as const,
      isWhiteContainer: true,
    },
  ] as PrivilegeSection[],
};
