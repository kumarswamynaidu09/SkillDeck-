import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const FAKE_PROFILES = [
  // --- SEEKERS (CANDIDATES) ---
  {
    id: 'fake_seeker_1', user_type: 'seeker', full_name: 'Alex Chen', title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Passionate about building fast, accessible web applications. I love React, 3D web graphics, and clean architecture.',
    skills: [ { name: 'React', level: 'Advanced' }, { name: 'TypeScript', level: 'Advanced' }, { name: 'Three.js', level: 'Intermediate' } ],
    experience: [
      { id: 1, company: 'Vercel', role: 'Frontend Engineer', duration: 'Jan 2023 - Present', description: 'Core team working on Next.js routing.' },
      { id: 2, company: 'Stripe', role: 'UI Developer', duration: 'Mar 2021 - Jan 2023', description: 'Built internal dashboard tools.' }
    ],
    education: [ { id: 1, school: 'UC Berkeley', degree: 'B.S. Computer Science', year: '2021' } ]
  },
  {
    id: 'fake_seeker_2', user_type: 'seeker', full_name: 'Sarah Jenkins', title: 'Product Designer',
    location: 'New York, NY', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'I turn complex problems into elegant, simple user experiences. Heavy focus on design systems and micro-interactions.',
    skills: [ { name: 'Figma', level: 'Advanced' }, { name: 'Framer', level: 'Advanced' }, { name: 'CSS', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'Airbnb', role: 'Product Designer', duration: 'Jun 2020 - Present', description: 'Led the redesign of the host dashboard.' } ],
    education: [ { id: 1, school: 'Rhode Island School of Design', degree: 'B.F.A Industrial Design', year: '2020' } ]
  },
  {
    id: 'fake_seeker_3', user_type: 'seeker', full_name: 'David Kim', title: 'Backend Systems Engineer',
    location: 'Seattle, WA', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    bio: 'Scaling databases and building microservices. I thrive in high-traffic environments.',
    skills: [ { name: 'Go', level: 'Advanced' }, { name: 'PostgreSQL', level: 'Advanced' }, { name: 'Docker', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'Amazon', role: 'Backend Engineer', duration: 'Aug 2019 - Present', description: 'AWS Lambda execution engine team.' } ],
    education: [ { id: 1, school: 'Univ of Washington', degree: 'M.S. Computer Science', year: '2019' } ]
  },
  {
    id: 'fake_seeker_4', user_type: 'seeker', full_name: 'Elena Rodriguez', title: 'AI/ML Researcher',
    location: 'Austin, TX', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    bio: 'Focusing on LLM optimization and fine-tuning. Looking for a startup pushing the boundaries of generative AI.',
    skills: [ { name: 'Python', level: 'Advanced' }, { name: 'PyTorch', level: 'Advanced' }, { name: 'TensorFlow', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'OpenAI', role: 'Research Assistant', duration: 'Feb 2022 - Present', description: 'Working on efficient attention mechanisms.' } ],
    education: [ { id: 1, school: 'Stanford', degree: 'Ph.D. Computer Science', year: '2024' } ]
  },
  {
    id: 'fake_seeker_5', user_type: 'seeker', full_name: 'James Wilson', title: 'Full Stack Ninja',
    location: 'London, UK', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    bio: 'I build products from 0 to 1. Comfortable with everything from database schema design to CSS animations.',
    skills: [ { name: 'Next.js', level: 'Advanced' }, { name: 'Node.js', level: 'Advanced' }, { name: 'MongoDB', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'Startup Inc', role: 'Lead Developer', duration: 'Jan 2020 - Present', description: 'Built entire MVP.' } ],
    education: [ { id: 1, school: 'Imperial College', degree: 'B.Eng Software Engineering', year: '2020' } ]
  },
  {
    id: 'fake_seeker_6', user_type: 'seeker', full_name: 'Mia Wong', title: 'Mobile Developer (iOS)',
    location: 'Toronto, CA', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    bio: 'Swift enthusiast. I love building buttery smooth iOS applications with a heavy focus on animation.',
    skills: [ { name: 'Swift', level: 'Advanced' }, { name: 'SwiftUI', level: 'Advanced' }, { name: 'Objective-C', level: 'Basic' } ],
    experience: [ { id: 1, company: 'Shopify', role: 'iOS Engineer', duration: 'May 2021 - Present', description: 'Shopify POS app.' } ],
    education: [ { id: 1, school: 'Waterloo', degree: 'B.S. Software Engineering', year: '2021' } ]
  },
  {
    id: 'fake_seeker_7', user_type: 'seeker', full_name: 'Omar Hassan', title: 'DevOps & Cloud Architect',
    location: 'Dubai, UAE', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    bio: 'If it can be automated, I will automate it. Passionate about CI/CD, Kubernetes, and uptime.',
    skills: [ { name: 'Kubernetes', level: 'Advanced' }, { name: 'AWS', level: 'Advanced' }, { name: 'Terraform', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'Careem', role: 'Site Reliability Engineer', duration: 'Sep 2018 - Present', description: 'Managing 100+ microservices.' } ],
    education: [ { id: 1, school: 'MIT', degree: 'B.S. Computer Science', year: '2018' } ]
  },
  {
    id: 'fake_seeker_8', user_type: 'seeker', full_name: 'Chloe Dubois', title: 'Data Scientist',
    location: 'Paris, FR', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
    bio: 'Finding the story behind the numbers. Predictive modeling, A/B testing, and data visualization.',
    skills: [ { name: 'SQL', level: 'Advanced' }, { name: 'Pandas', level: 'Advanced' }, { name: 'Tableau', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'Spotify', role: 'Data Analyst', duration: 'Oct 2020 - Present', description: 'Recommendation algorithm metrics.' } ],
    education: [ { id: 1, school: 'Sorbonne', degree: 'M.S. Applied Math', year: '2020' } ]
  },
  {
    id: 'fake_seeker_9', user_type: 'seeker', full_name: 'Liam Smith', title: 'Cybersecurity Analyst',
    location: 'Remote', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    bio: 'White-hat hacker. Finding vulnerabilities before the bad guys do.',
    skills: [ { name: 'Pen Testing', level: 'Advanced' }, { name: 'Network Security', level: 'Advanced' }, { name: 'Python', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'CrowdStrike', role: 'Security Engineer', duration: 'Dec 2021 - Present', description: 'Threat detection.' } ],
    education: [ { id: 1, school: 'NYU', degree: 'B.S. Cybersecurity', year: '2021' } ]
  },
  {
    id: 'fake_seeker_10', user_type: 'seeker', full_name: 'Aisha Patel', title: 'Growth Product Manager',
    location: 'Berlin, DE', industry: 'Any', deck_created: true, onboarding_completed: true,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    bio: 'Obsessed with user acquisition and retention. I bridge the gap between engineering and marketing.',
    skills: [ { name: 'Agile', level: 'Advanced' }, { name: 'Mixpanel', level: 'Advanced' }, { name: 'Jira', level: 'Intermediate' } ],
    experience: [ { id: 1, company: 'N26', role: 'Product Manager', duration: 'Jul 2019 - Present', description: 'Led the referral program squad.' } ],
    education: [ { id: 1, school: 'LSE', degree: 'B.Sc. Economics', year: '2019' } ]
  },

  // --- RECRUITERS (COMPANIES) ---
  {
    id: 'fake_recruiter_1', user_type: 'recruiter', full_name: 'FinTech Nexus', title: 'Senior React Developer',
    location: 'New York, NY', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$140k - $180k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Nexus',
    bio: 'We are revolutionizing B2B payments. Looking for a React wizard to own our frontend architecture. Great benefits, 100% remote options.'
  },
  {
    id: 'fake_recruiter_2', user_type: 'recruiter', full_name: 'HealthAI', title: 'Machine Learning Engineer',
    location: 'Boston, MA', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$150k - $200k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Health',
    bio: 'Using AI to detect early signs of disease. We need experts in computer vision and PyTorch.'
  },
  {
    id: 'fake_recruiter_3', user_type: 'recruiter', full_name: 'GameVerse', title: '3D UI Developer',
    location: 'Los Angeles, CA', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$120k - $160k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Game',
    bio: 'Building the next generation of web-based gaming. If you know Three.js and React-Three-Fiber, we want you.'
  },
  {
    id: 'fake_recruiter_4', user_type: 'recruiter', full_name: 'EcoLogistics', title: 'Backend Systems Engineer',
    location: 'Remote', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$130k - $160k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Eco',
    bio: 'Optimizing supply chains to reduce carbon footprints. Heavy Go and Kubernetes environment.'
  },
  {
    id: 'fake_recruiter_5', user_type: 'recruiter', full_name: 'EduStream', title: 'Mobile Developer (iOS/Android)',
    location: 'London, UK', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '£80k - £110k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Edu',
    bio: 'Making education accessible via mobile. We are rebuilding our app in React Native.'
  },
  {
    id: 'fake_recruiter_6', user_type: 'recruiter', full_name: 'CyberShield', title: 'Security Consultant',
    location: 'Washington, DC', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$110k - $150k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Cyber',
    bio: 'Protecting enterprise clients from advanced persistent threats. Secret clearance is a plus.'
  },
  {
    id: 'fake_recruiter_7', user_type: 'recruiter', full_name: 'DesignStudio', title: 'Lead Product Designer',
    location: 'Berlin, DE', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '€90k - €120k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Design',
    bio: 'Boutique agency working with top-tier SaaS companies. Looking for a visionary to lead our design team.'
  },
  {
    id: 'fake_recruiter_8', user_type: 'recruiter', full_name: 'DataFlow Inc', title: 'Data Engineer',
    location: 'Toronto, CA', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$120k - $150k CAD',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Data',
    bio: 'Building massive data pipelines. You should dream in SQL and Python.'
  },
  {
    id: 'fake_recruiter_9', user_type: 'recruiter', full_name: 'AeroSpace X', title: 'Embedded Systems Engineer',
    location: 'Houston, TX', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$140k - $190k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Aero',
    bio: 'Writing code that literally goes to space. C/C++ experts only.'
  },
  {
    id: 'fake_recruiter_10', user_type: 'recruiter', full_name: 'CreatorCoin', title: 'Smart Contract Developer',
    location: 'Miami, FL / Remote', industry: 'Any', deck_created: true, onboarding_completed: true, salary: '$160k - $220k',
    avatar_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Crypto',
    bio: 'Building Web3 tools for creators. Solidity and Web3.js experience required.'
  }
];

export const seedFakeData = async () => {
  console.log("Starting to seed database...");
  let count = 0;
  for (const profile of FAKE_PROFILES) {
    try {
      await setDoc(doc(db, "users", profile.id), profile);
      count++;
    } catch (err) {
      console.error(`Error saving ${profile.full_name}:`, err);
    }
  }
  return count;
};