export interface PortfolioData {
  name: string;
  role: string;
  experience: string;
  bio: string;
  skills: string[];
  theme: string;
  avatar: string;
  projects: {
    title: string;
    description: string;
    tags: string[];
  }[];
}

export const getPortfolioByTheme = (theme: string): PortfolioData => {
  const baseData = {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce solution with real-time inventory management',
        tags: ['React', 'Node.js', 'MongoDB']
      },
      {
        title: 'Data Visualization Dashboard',
        description: 'Interactive dashboard for analyzing business metrics and KPIs',
        tags: ['D3.js', 'TypeScript', 'REST API']
      },
      {
        title: 'Mobile App Redesign',
        description: 'Complete UI/UX overhaul for a fintech mobile application',
        tags: ['Figma', 'UI/UX', 'Prototyping']
      }
    ]
  };

  const roles = {
    'vibrant': {
      role: 'UI/UX & Graphic Designer',
      experience: '5+ years crafting beautiful digital experiences',
      bio: 'I create visually stunning and intuitive user interfaces that blend aesthetics with functionality. My designs tell stories and create emotional connections with users.',
      skills: ['UI/UX Design', 'Motion Graphics', 'Brand Identity', 'User Research', 'Prototyping', 'Figma', 'Adobe Creative Suite'],
      theme: 'vibrant'
    },
    'code-style': {
      role: 'Full-Stack Developer',
      experience: '6+ years building scalable web applications',
      bio: 'I architect and develop robust, performant web applications using modern technologies. Passionate about clean code and efficient solutions.',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'CI/CD'],
      theme: 'code-style'
    },
    'data-centric': {
      role: 'Data Scientist & Analyst',
      experience: '4+ years turning data into insights',
      bio: 'I uncover hidden patterns in data and transform them into actionable business intelligence. My analyses drive strategic decision-making.',
      skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization', 'A/B Testing', 'Tableau', 'TensorFlow'],
      theme: 'data-centric'
    },
    'default': {
      role: 'Digital Product Manager',
      experience: '5+ years leading digital initiatives',
      bio: 'I bridge the gap between business goals and technical implementation, ensuring products deliver real value to users.',
      skills: ['Product Strategy', 'Agile Methodologies', 'User Stories', 'Market Research', 'Roadmapping', 'Stakeholder Management'],
      theme: 'default'
    }
  };

  return { ...baseData, ...roles[theme as keyof typeof roles] || roles['default'] };
};
