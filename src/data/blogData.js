export const themeColors = {
  brandBlue: '#1B4F9C',
  brandNavy: '#0A1F2E',
  brandTeal: '#00BFA6',
  brandGreen: '#16A34A',
};

export const categories = [
  'All',
  'Digital Marketing',
  'SEO',
  'Social Media',
  'Branding',
  'Political',
  'Trends',
];

export const tags = [
  'Agency',
  'Business',
  'Digital',
  'Marketing',
  'Startup',
  'Technology',
  'Trendy',
];

export const blogs = [
  {
    id: 1,
    category: 'Digital Marketing',
    title: '10 Digital Marketing Trends Dominating 2025',
    excerpt:
      'From AI‑generated content to hyper‑personalized ads — discover the top trends shaping digital marketing this year and how to leverage them for your brand.',
    date: 'June 15, 2025',
    readTime: '5 min read',
    author: 'Rahul Sharma',
    authorRole: 'CEO',
    avatar: 'RS',
    color: themeColors.brandBlue,
    featured: true,
    image: '/Future of digital marketing.webp',
    body: [
      {
        type: 'paragraph',
        text: 'Digital marketing in 2025 is about combining human creativity with smart automation. Leading brands are using AI to generate scalable content, personalization engines to tailor every campaign, and immersive experiences to deepen customer loyalty.',
      },
      {
        type: 'heading',
        text: 'Hyper-personalization is table stakes',
      },
      {
        type: 'paragraph',
        text: 'Audiences now expect content, offers, and journeys designed specifically for them. Marketers who can deliver this at scale will win stronger engagement and higher conversion rates.',
      },
      {
        type: 'list',
        items: [
          'AI-assisted creative workflows for faster campaign production',
          'Real-time audience segmentation with behavioral triggers',
          'Performance measurement that ties brand activity to sales outcomes',
        ],
      },
    ],
  },
  {
    id: 2,
    category: 'SEO',
    title: 'How to Rank on Google’s First Page in 2025',
    excerpt:
      'A practical, no‑fluff guide to modern SEO — covering Core Web Vitals, E‑E‑A‑T, AI‑driven search, and link‑building strategies that actually work.',
    date: 'June 10, 2025',
    readTime: '7 min read',
    author: 'Sneha Patil',
    authorRole: 'SEO Lead',
    avatar: 'SP',
    color: themeColors.brandNavy,
    featured: false,
    image: '/SEO-in-2025.webp',
    body: [
      {
        type: 'paragraph',
        text: 'Search in 2025 rewards content that feels genuinely helpful and trustworthy. Technical excellence is still essential, but the strongest SEO gains come from pages that solve real problems and earn external endorsement.',
      },
      {
        type: 'heading',
        text: 'Focus on strong page experience',
      },
      {
        type: 'paragraph',
        text: 'Fast loading, stable layout, and mobile-first design remain critical. Use page speed testing as a baseline, then improve readability and trust signals for people who land on your site.',
      },
      {
        type: 'list',
        items: [
          'Optimize Core Web Vitals and mobile rendering',
          'Create content that answers search intent clearly',
          'Build topical authority through linked pages and internal structure',
        ],
      },
    ],
  },
  {
    id: 3,
    category: 'Social Media',
    title: 'Instagram Reels vs YouTube Shorts: Where Should Your Brand Be?',
    excerpt:
      'Short‑form video is king — but which platform wins for your brand? We break down the audience, algorithm, and ROI of each platform with real data.',
    date: 'June 5, 2025',
    readTime: '4 min read',
    author: 'Priya Mehta',
    authorRole: 'Strategy Head',
    avatar: 'PM',
    color: themeColors.brandTeal,
    featured: false,
    image: '/hero-slide-3.png',
    body: [
      {
        type: 'paragraph',
        text: 'Short-form video platforms have become the best way for brands to attract attention quickly. But each channel has its own strengths: Instagram for visual storytelling and discovery, YouTube for search longevity and deeper engagement.',
      },
      {
        type: 'heading',
        text: 'Choose based on audience and objectives',
      },
      {
        type: 'list',
        items: [
          'Instagram Reels is ideal for brand awareness and trend-driven campaigns',
          'YouTube Shorts works well for education, product demos, and evergreen visibility',
          'Cross-post with native creative and platform-specific captions',
        ],
      },
    ],
  },
  {
    id: 4,
    category: 'Branding',
    title: 'Why Brand Identity is Your Most Valuable Business Asset',
    excerpt:
      'A strong brand isn’t just a logo — it’s the feeling people get when they interact with your business. Here’s how to build one that lasts.',
    date: 'May 28, 2025',
    readTime: '6 min read',
    author: 'Amit Kulkarni',
    authorRole: 'Creative Director',
    avatar: 'AK',
    color: themeColors.brandBlue,
    featured: false,
    image: '/creative1.jpeg',
    body: [
      {
        type: 'paragraph',
        text: 'Brand identity is the combination of visuals, messaging, and experience that makes your business memorable. The strongest identities are consistent, flexible, and built around a clear promise.',
      },
      {
        type: 'heading',
        text: 'Build identity with clarity',
      },
      {
        type: 'list',
        items: [
          'Define your mission and personality clearly',
          'Use color, typography, and tone consistently across touchpoints',
          'Create a visual system that works on digital, print, and live experiences',
        ],
      },
    ],
  },
  {
    id: 5,
    category: 'Political',
    title: 'How Political Campaigns Are Using Digital to Win Elections',
    excerpt:
      'Digital campaigning has transformed modern elections. Learn the strategies top campaigns use — from micro‑targeting voters to viral content creation.',
    date: 'May 20, 2025',
    readTime: '8 min read',
    author: 'Rahul Sharma',
    authorRole: 'CEO',
    avatar: 'RS',
    color: themeColors.brandBlue,
    featured: false,
    image: '/parliament-01.png',
    body: [
      {
        type: 'paragraph',
        text: 'Digital channels provide campaigns with the ability to reach voters where they spend time. Smart campaigns combine persuasive messaging, data-driven targeting, and rapid testing to improve engagement.',
      },
      {
        type: 'heading',
        text: 'Digital gives campaigns speed and scale',
      },
      {
        type: 'list',
        items: [
          'Use audience insights to tailor messages for different constituencies',
          'Pair organic content with paid amplification for broader reach',
          'Measure impact with engagement and conversion metrics',
        ],
      },
    ],
  },
  {
    id: 6,
    category: 'Trends',
    title: 'AI in Marketing: Hype or the Future?',
    excerpt:
      'Artificial Intelligence is reshaping how brands create content, target audiences, and measure success. Here’s the honest truth about what AI can and cannot do.',
    date: 'May 12, 2025',
    readTime: '5 min read',
    author: 'Priya Mehta',
    authorRole: 'Strategy Head',
    avatar: 'PM',
    color: themeColors.brandNavy,
    featured: false,
    image: '/your-busines-is-a-movie.webp',
    body: [
      {
        type: 'paragraph',
        text: 'AI is no longer a buzzword. It is now a practical tool for marketers who want to produce content faster, personalize campaigns, and discover hidden customer insights.',
      },
      {
        type: 'heading',
        text: 'Use AI to augment, not replace, creativity',
      },
      {
        type: 'list',
        items: [
          'Automate repetitive tasks like content briefs and reporting',
          'Use AI to identify trends, not to finalise messaging alone',
          'Keep human oversight in every step to preserve brand voice',
        ],
      },
    ],
  },
];
