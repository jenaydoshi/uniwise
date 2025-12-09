import { 
  User, 
  MenteeProfile, 
  MentorProfile, 
  Connection, 
  ChatMessage, 
  CommunityThread, 
  CommunityAnswer,
  VerificationRequest,
  AdminReport 
} from './types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Sample Users (Mentors)
export const sampleMentorUsers: User[] = [
  {
    id: 'mentor-1',
    email: 'arjun.sharma@iitb.ac.in',
    password: 'password123',
    name: 'Arjun Sharma',
    role: 'mentor',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    profilePhotoUrl: '/images/mentors/arjun.jpg'
  },
  {
    id: 'mentor-2',
    email: 'priya.patel@aiims.edu',
    password: 'password123',
    name: 'Dr. Priya Patel',
    role: 'mentor',
    createdAt: '2024-05-20T08:00:00Z',
    updatedAt: '2024-11-18T09:15:00Z',
    profilePhotoUrl: '/images/mentors/priya.jpg'
  },
  {
    id: 'mentor-3',
    email: 'rahul.verma@nludelhi.ac.in',
    password: 'password123',
    name: 'Rahul Verma',
    role: 'mentor',
    createdAt: '2024-07-10T12:00:00Z',
    updatedAt: '2024-11-22T16:45:00Z',
    profilePhotoUrl: '/images/mentors/rahul.jpg'
  },
  {
    id: 'mentor-4',
    email: 'sneha.gupta@bits.ac.in',
    password: 'password123',
    name: 'Sneha Gupta',
    role: 'mentor',
    createdAt: '2024-04-25T09:30:00Z',
    updatedAt: '2024-11-19T11:20:00Z',
    profilePhotoUrl: '/images/mentors/sneha.jpg'
  },
  {
    id: 'mentor-5',
    email: 'vikram.singh@iitd.ac.in',
    password: 'password123',
    name: 'Vikram Singh',
    role: 'mentor',
    createdAt: '2024-08-05T14:00:00Z',
    updatedAt: '2024-11-21T10:00:00Z',
    profilePhotoUrl: '/images/mentors/vikram.jpg'
  },
  {
    id: 'mentor-6',
    email: 'ananya.krishnan@nitw.ac.in',
    password: 'password123',
    name: 'Ananya Krishnan',
    role: 'mentor',
    createdAt: '2024-06-30T11:00:00Z',
    updatedAt: '2024-11-20T15:30:00Z',
    profilePhotoUrl: '/images/mentors/ananya.jpg'
  },
  {
    id: 'mentor-7',
    email: 'karthik.iyer@iimb.ac.in',
    password: 'password123',
    name: 'Karthik Iyer',
    role: 'mentor',
    createdAt: '2024-05-15T13:00:00Z',
    updatedAt: '2024-11-17T12:45:00Z',
    profilePhotoUrl: '/images/mentors/karthik.jpg'
  },
  {
    id: 'mentor-8',
    email: 'meera.reddy@aiims.edu',
    password: 'password123',
    name: 'Dr. Meera Reddy',
    role: 'mentor',
    createdAt: '2024-07-20T10:30:00Z',
    updatedAt: '2024-11-23T09:00:00Z',
    profilePhotoUrl: '/images/mentors/meera.jpg'
  },
  {
    id: 'mentor-9',
    email: 'aditya.jain@iitk.ac.in',
    password: 'password123',
    name: 'Aditya Jain',
    role: 'mentor',
    createdAt: '2024-08-10T08:00:00Z',
    updatedAt: '2024-11-22T14:15:00Z',
    profilePhotoUrl: '/images/mentors/aditya.jpg'
  },
  {
    id: 'mentor-10',
    email: 'pooja.mehta@nluj.ac.in',
    password: 'password123',
    name: 'Pooja Mehta',
    role: 'mentor',
    createdAt: '2024-06-05T15:00:00Z',
    updatedAt: '2024-11-19T16:30:00Z',
    profilePhotoUrl: '/images/mentors/pooja.jpg'
  },
  {
    id: 'mentor-11',
    email: 'rohan.das@iitm.ac.in',
    password: 'password123',
    name: 'Rohan Das',
    role: 'mentor',
    createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2024-11-24T11:00:00Z',
    profilePhotoUrl: '/images/mentors/rohan.jpg'
  },
  {
    id: 'mentor-12',
    email: 'ishita.banerjee@bits.ac.in',
    password: 'password123',
    name: 'Ishita Banerjee',
    role: 'mentor',
    createdAt: '2024-07-15T12:30:00Z',
    updatedAt: '2024-11-20T13:45:00Z',
    profilePhotoUrl: '/images/mentors/ishita.jpg'
  },
  {
    id: 'mentor-13',
    email: 'sanjay.kumar@nitt.edu',
    password: 'password123',
    name: 'Sanjay Kumar',
    role: 'mentor',
    createdAt: '2024-08-20T14:00:00Z',
    updatedAt: '2024-11-21T17:00:00Z',
    profilePhotoUrl: '/images/mentors/sanjay.jpg'
  },
  {
    id: 'mentor-14',
    email: 'divya.nair@aiims.edu',
    password: 'password123',
    name: 'Dr. Divya Nair',
    role: 'mentor',
    createdAt: '2024-05-10T11:30:00Z',
    updatedAt: '2024-11-18T10:30:00Z',
    profilePhotoUrl: '/images/mentors/divya.jpg'
  },
  {
    id: 'mentor-15',
    email: 'amit.pandey@iith.ac.in',
    password: 'password123',
    name: 'Amit Pandey',
    role: 'mentor',
    createdAt: '2024-09-10T10:00:00Z',
    updatedAt: '2024-11-23T15:00:00Z',
    profilePhotoUrl: '/images/mentors/amit.jpg'
  }
];

// Mentor Profiles
export const sampleMentorProfiles: MentorProfile[] = [
  {
    userId: 'mentor-1',
    college: 'IIT Bombay',
    major: 'Computer Science',
    year: 'third',
    city: 'Mumbai',
    state: 'Maharashtra',
    languages: ['English', 'Hindi', 'Marathi'],
    topics: ['JEE Advanced', 'JEE Main', 'Campus Life', 'Internships', 'Coding'],
    bio: 'AIR 156 in JEE Advanced 2022. Currently pursuing B.Tech in CS at IIT Bombay. Passionate about helping students crack JEE and navigate the IIT journey. Open to discussing coding, internships, and campus life!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How did you prepare for JEE?', answer: 'I focused on NCERT first, then moved to HC Verma and Cengage. Consistent practice and mock tests were key.' },
      { question: 'What is campus life like at IIT Bombay?', answer: 'Extremely vibrant! We have 100+ clubs, tech fests like Techfest, and amazing peer learning opportunities.' },
      { question: 'When should I start preparing for JEE?', answer: 'Ideally Class 11, but it\'s never too late. Focus on concepts first, then practice.' }
    ],
    availability: '10 hours/week'
  },
  {
    userId: 'mentor-2',
    college: 'AIIMS Delhi',
    major: 'MBBS',
    year: 'fourth',
    city: 'New Delhi',
    state: 'Delhi',
    languages: ['English', 'Hindi', 'Gujarati'],
    topics: ['NEET', 'Medical Admissions', 'Campus Life', 'Study Tips'],
    bio: 'NEET AIR 89 in 2021. Currently in 4th year MBBS at AIIMS Delhi. I know how stressful NEET prep can be - let me help you with strategy, resources, and motivation!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How many hours did you study daily?', answer: '8-10 hours during Class 12, but quality matters more than quantity. Take breaks!' },
      { question: 'Is NCERT enough for NEET?', answer: 'NCERT is 80% of the battle. Master it first, then supplement with reference books.' },
      { question: 'How to manage boards and NEET together?', answer: 'Board prep and NEET overlap significantly. Focus on NCERT for both.' }
    ],
    availability: '8 hours/week'
  },
  {
    userId: 'mentor-3',
    college: 'NLU Delhi',
    major: 'Law (B.A. LL.B)',
    year: 'graduated',
    city: 'New Delhi',
    state: 'Delhi',
    languages: ['English', 'Hindi'],
    topics: ['CLAT', 'Law School Life', 'Legal Careers', 'Moot Courts'],
    bio: 'CLAT 2019 AIR 42. Graduated from NLU Delhi in 2024. Currently working at a top law firm. Happy to guide aspiring lawyers on CLAT prep and law school journey!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How to prepare for CLAT?', answer: 'Read newspapers daily, practice legal reasoning, and take lots of mocks.' },
      { question: 'Is law a good career choice?', answer: 'Absolutely! Diverse options - litigation, corporate, policy, judiciary, and more.' },
      { question: 'What makes NLU Delhi special?', answer: 'Location advantage in Delhi, excellent faculty, and strong alumni network.' }
    ],
    availability: '5 hours/week'
  },
  {
    userId: 'mentor-4',
    college: 'BITS Pilani',
    major: 'Electronics & Communication',
    year: 'fourth',
    city: 'Pilani',
    state: 'Rajasthan',
    languages: ['English', 'Hindi', 'Punjabi'],
    topics: ['BITSAT', 'JEE Main', 'Campus Life', 'Placements', 'Startups'],
    bio: 'BITSAT Score: 402/450. Love the BITS culture of freedom and responsibility. Currently interning at a tech startup. Ask me anything about BITSAT, BITS life, or tech careers!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How is BITSAT different from JEE?', answer: 'BITSAT is computer-based, faster-paced, and tests speed. Bonus questions can be game-changers!' },
      { question: 'What is BITS culture like?', answer: 'No attendance, flexible course selection, amazing fests. You learn to manage your own time.' },
      { question: 'Can I do dual degree at BITS?', answer: 'Yes! BITS offers dual degree with MSc or MBA. It\'s a great option.' }
    ],
    availability: '6 hours/week'
  },
  {
    userId: 'mentor-5',
    college: 'IIT Delhi',
    major: 'Electrical Engineering',
    year: 'second',
    city: 'New Delhi',
    state: 'Delhi',
    languages: ['English', 'Hindi'],
    topics: ['JEE Advanced', 'JEE Main', 'Physics', 'Mathematics', 'Study Planning'],
    bio: 'JEE Advanced AIR 234. Physics and Math enthusiast. I believe in smart work over hard work. Let me help you optimize your JEE preparation strategy!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'What books do you recommend for Physics?', answer: 'HC Verma for concepts, Irodov for advanced problems, DC Pandey for practice.' },
      { question: 'How to improve in Mathematics?', answer: 'Practice daily. Start with basics, then move to PYQs. RD Sharma + Cengage worked for me.' },
      { question: 'How to handle exam pressure?', answer: 'Mock tests simulate pressure. Take them seriously. Also, sleep well before exams!' }
    ],
    availability: '12 hours/week'
  },
  {
    userId: 'mentor-6',
    college: 'NIT Warangal',
    major: 'Mechanical Engineering',
    year: 'third',
    city: 'Warangal',
    state: 'Telangana',
    languages: ['English', 'Hindi', 'Telugu'],
    topics: ['JEE Main', 'Campus Life', 'Scholarships', 'Research'],
    bio: 'JEE Main 99.2 percentile. First-generation engineer from a small town in Telangana. I understand the challenges of preparing without expensive coaching. Happy to help!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'Can I crack JEE without coaching?', answer: 'Absolutely! I did it with YouTube lectures and free resources. Consistency is key.' },
      { question: 'How is life at NIT?', answer: 'Great balance of academics and extracurriculars. Beautiful campus, supportive seniors.' },
      { question: 'How to get scholarships?', answer: 'Apply early! MCM scholarship, state scholarships, and private foundations all help.' }
    ],
    availability: '8 hours/week'
  },
  {
    userId: 'mentor-7',
    college: 'IIM Bangalore',
    major: 'MBA (PGP)',
    year: 'second',
    city: 'Bangalore',
    state: 'Karnataka',
    languages: ['English', 'Hindi', 'Tamil'],
    topics: ['IPMAT', 'CAT', 'MBA Admissions', 'Career Guidance'],
    bio: 'IPMAT AIR 15, CAT 99.5%ile. Engineer turned MBA student. If you\'re confused between engineering and management, I can help you explore options!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'Is IPMAT worth it?', answer: 'If you\'re sure about management, 5-year integrated program at IIMs is excellent!' },
      { question: 'How to prepare for IPMAT?', answer: 'Quant from CAT books, verbal from GRE resources, practice mocks regularly.' },
      { question: 'What after MBA?', answer: 'Consulting, finance, product management, startups - options are endless!' }
    ],
    availability: '4 hours/week'
  },
  {
    userId: 'mentor-8',
    college: 'AIIMS Delhi',
    major: 'MBBS',
    year: 'third',
    city: 'New Delhi',
    state: 'Delhi',
    languages: ['English', 'Hindi', 'Telugu'],
    topics: ['NEET', 'Biology', 'Medical Life', 'Research'],
    bio: 'NEET AIR 156. Biology lover since childhood. Currently involved in research at AIIMS. Can help with NEET strategy and understanding medical career paths.',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How to score 360+ in Biology?', answer: 'NCERT line-by-line reading, diagrams, and PYQ analysis. Biology is scoring!' },
      { question: 'Is AIIMS life very stressful?', answer: 'It\'s demanding but rewarding. Good time management helps a lot.' },
      { question: 'Can I do research during MBBS?', answer: 'Yes! AIIMS has great research opportunities. Start early and find good mentors.' }
    ],
    availability: '6 hours/week'
  },
  {
    userId: 'mentor-9',
    college: 'IIT Kanpur',
    major: 'Chemical Engineering',
    year: 'fourth',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    languages: ['English', 'Hindi'],
    topics: ['JEE Advanced', 'Chemistry', 'Campus Life', 'Higher Studies'],
    bio: 'JEE Advanced AIR 512. Chemistry enthusiast. Planning for PhD abroad. Can help with JEE Chemistry strategy and guide about higher studies options.',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How to improve in Organic Chemistry?', answer: 'Understand mechanisms, not just reactions. MS Chauhan is great for practice.' },
      { question: 'Is Chemical Engineering good?', answer: 'Great for those interested in chemistry + engineering. Diverse career options.' },
      { question: 'How to plan for PhD abroad?', answer: 'Good GPA, research experience, strong LORs, and GRE score. Start early!' }
    ],
    availability: '7 hours/week'
  },
  {
    userId: 'mentor-10',
    college: 'NLU Jodhpur',
    major: 'Law (B.A. LL.B)',
    year: 'fourth',
    city: 'Jodhpur',
    state: 'Rajasthan',
    languages: ['English', 'Hindi', 'Rajasthani'],
    topics: ['CLAT', 'Legal Reasoning', 'Campus Life', 'Internships'],
    bio: 'CLAT 2021 AIR 78. From a small town in Rajasthan. Passionate about constitutional law. Can help with CLAT prep and understanding law school life.',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How to crack Legal Reasoning?', answer: 'Practice lots of passages, understand principles, and work on logical thinking.' },
      { question: 'Are internships important in law?', answer: 'Crucial! Start from first year. Diverse internships help you find your interest.' },
      { question: 'What is campus life like at NLU Jodhpur?', answer: 'Desert campus but vibrant community. Great moot court culture.' }
    ],
    availability: '6 hours/week'
  },
  {
    userId: 'mentor-11',
    college: 'IIT Madras',
    major: 'Aerospace Engineering',
    year: 'third',
    city: 'Chennai',
    state: 'Tamil Nadu',
    languages: ['English', 'Hindi', 'Tamil', 'Bengali'],
    topics: ['JEE Advanced', 'JEE Main', 'Campus Life', 'ISRO/DRDO Careers'],
    bio: 'JEE Advanced AIR 189. Space enthusiast since childhood. IIT Madras is amazing for aerospace! Can guide about JEE and careers in space/defense sector.',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'How is Aerospace Engineering?', answer: 'Fascinating field! Math-heavy but very rewarding if you love physics and space.' },
      { question: 'How to get into ISRO?', answer: 'IIST direct entry, ISRO exam after BTech, or GATE. Multiple paths available!' },
      { question: 'What makes IIT Madras special?', answer: 'Beautiful campus, strong research culture, and excellent faculty. Also, the food!' }
    ],
    availability: '9 hours/week'
  },
  {
    userId: 'mentor-12',
    college: 'BITS Pilani',
    major: 'Computer Science',
    year: 'third',
    city: 'Pilani',
    state: 'Rajasthan',
    languages: ['English', 'Hindi', 'Bengali'],
    topics: ['BITSAT', 'JEE Main', 'Coding', 'Placements', 'Open Source'],
    bio: 'BITSAT 391, JEE Main 98.8%ile. Chose BITS for the freedom. Active in coding communities and open source. Can help with BITSAT prep and tech careers!',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'BITS CS vs IIT lower branch?', answer: 'Depends on your goals. For tech careers, BITS CS is excellent!' },
      { question: 'How to start with competitive coding?', answer: 'Start with Codeforces, LeetCode. Consistency over intensity!' },
      { question: 'How are placements at BITS?', answer: 'Top companies visit. CS/EE have great opportunities. CTC can be 30-50 LPA for top students.' }
    ],
    availability: '8 hours/week'
  },
  {
    userId: 'mentor-13',
    college: 'NIT Trichy',
    major: 'Civil Engineering',
    year: 'fourth',
    city: 'Trichy',
    state: 'Tamil Nadu',
    languages: ['English', 'Hindi', 'Tamil'],
    topics: ['JEE Main', 'Campus Life', 'GATE', 'Government Jobs'],
    bio: 'JEE Main 98.5%ile. Currently preparing for GATE alongside placements. Can guide about NIT life, GATE prep, and PSU/government job options.',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'Is Civil Engineering dying?', answer: 'Not at all! Infrastructure is booming. Government sector has huge demand.' },
      { question: 'How to prepare for GATE?', answer: 'Start from 3rd year, focus on basics, and practice standard books.' },
      { question: 'How is NIT Trichy campus?', answer: 'One of the best NIT campuses! Great hostels, food, and cultural life.' }
    ],
    availability: '7 hours/week'
  },
  {
    userId: 'mentor-14',
    college: 'AIIMS Delhi',
    major: 'MBBS',
    year: 'second',
    city: 'New Delhi',
    state: 'Delhi',
    languages: ['English', 'Hindi', 'Malayalam'],
    topics: ['NEET', 'Study Tips', 'Mental Health', 'Medical Life'],
    bio: 'NEET AIR 203. From Kerala, now at AIIMS Delhi. Strong advocate for mental health during prep. Can help with NEET strategy and managing stress!',
    verificationStatus: 'pending',
    verificationBadge: false,
    faqs: [
      { question: 'How to stay motivated during NEET prep?', answer: 'Set small goals, celebrate wins, take breaks. Mental health is crucial!' },
      { question: 'What if I don\'t get AIIMS?', answer: 'Many great medical colleges! Focus on being a good doctor, not just the tag.' },
      { question: 'How to handle family pressure?', answer: 'Communicate openly. Show them your plan and dedication. Results will follow.' }
    ],
    availability: '5 hours/week'
  },
  {
    userId: 'mentor-15',
    college: 'IIT Hyderabad',
    major: 'Materials Science',
    year: 'second',
    city: 'Hyderabad',
    state: 'Telangana',
    languages: ['English', 'Hindi', 'Telugu'],
    topics: ['JEE Advanced', 'JEE Main', 'New IITs', 'Research'],
    bio: 'JEE Advanced AIR 1892. Chose new IIT for the research opportunities. IIT Hyderabad is underrated! Can guide about JEE and new IIT experience.',
    verificationStatus: 'verified',
    verificationBadge: true,
    faqs: [
      { question: 'Are new IITs worth it?', answer: 'Absolutely! Same degree, often better student-faculty ratio, growing rapidly.' },
      { question: 'Why Materials Science?', answer: 'Interdisciplinary field, great for research. Less competitive branch gives more flexibility.' },
      { question: 'How is IIT Hyderabad?', answer: 'Modern campus, excellent labs, supportive faculty. Growing alumni network.' }
    ],
    availability: '10 hours/week'
  }
];

// Sample Mentee Users
export const sampleMenteeUsers: User[] = [
  {
    id: 'mentee-1',
    email: 'ravi.kumar@gmail.com',
    password: 'password123',
    name: 'Ravi Kumar',
    role: 'mentee',
    createdAt: '2024-10-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    profilePhotoUrl: '/images/mentees/ravi.jpg'
  },
  {
    id: 'mentee-2',
    email: 'neha.singh@gmail.com',
    password: 'password123',
    name: 'Neha Singh',
    role: 'mentee',
    createdAt: '2024-10-20T08:00:00Z',
    updatedAt: '2024-11-18T09:15:00Z',
    profilePhotoUrl: '/images/mentees/neha.jpg'
  },
  {
    id: 'mentee-3',
    email: 'akash.patel@gmail.com',
    password: 'password123',
    name: 'Akash Patel',
    role: 'mentee',
    createdAt: '2024-11-01T12:00:00Z',
    updatedAt: '2024-11-22T16:45:00Z',
    profilePhotoUrl: '/images/mentees/akash.jpg'
  }
];

// Mentee Profiles
export const sampleMenteeProfiles: MenteeProfile[] = [
  {
    userId: 'mentee-1',
    class: '12',
    targetColleges: ['IIT Bombay', 'IIT Delhi', 'NIT Trichy'],
    exams: ['JEE Main', 'JEE Advanced'],
    interests: ['Computer Science', 'Electronics'],
    goalsText: 'Want to get into IIT CSE. Currently struggling with Physics and need guidance on time management.',
    city: 'Patna',
    state: 'Bihar'
  },
  {
    userId: 'mentee-2',
    class: '11',
    targetColleges: ['AIIMS Delhi', 'AIIMS Jodhpur', 'JIPMER'],
    exams: ['NEET'],
    interests: ['Biology', 'Research'],
    goalsText: 'Aspiring to become a doctor. First-generation student, need guidance on NEET preparation and college selection.',
    city: 'Lucknow',
    state: 'Uttar Pradesh'
  },
  {
    userId: 'mentee-3',
    class: '12',
    targetColleges: ['NLU Delhi', 'NLSIU Bangalore', 'NLU Jodhpur'],
    exams: ['CLAT'],
    interests: ['Constitutional Law', 'Human Rights'],
    goalsText: 'Want to become a lawyer. Interested in constitutional law and human rights. Need help with legal reasoning section.',
    city: 'Ahmedabad',
    state: 'Gujarat'
  }
];

// Admin User
export const adminUser: User = {
  id: 'admin-1',
  email: 'admin@uniwise.com',
  password: 'admin123',
  name: 'UniWise Admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-11-24T00:00:00Z'
};

// Sample Connections
export const sampleConnections: Connection[] = [
  {
    id: 'conn-1',
    menteeId: 'mentee-1',
    mentorId: 'mentor-1',
    status: 'accepted',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T12:00:00Z',
    message: 'Hi Arjun! I\'m preparing for JEE and struggling with Physics. Would love your guidance!'
  },
  {
    id: 'conn-2',
    menteeId: 'mentee-2',
    mentorId: 'mentor-2',
    status: 'accepted',
    createdAt: '2024-11-05T14:00:00Z',
    updatedAt: '2024-11-05T16:00:00Z',
    message: 'Hello Dr. Priya! I\'m a first-gen student preparing for NEET. Need help with strategy.'
  },
  {
    id: 'conn-3',
    menteeId: 'mentee-3',
    mentorId: 'mentor-3',
    status: 'pending',
    createdAt: '2024-11-20T09:00:00Z',
    updatedAt: '2024-11-20T09:00:00Z',
    message: 'Hi Rahul! Preparing for CLAT and interested in NLU Delhi. Can you guide me?'
  },
  {
    id: 'conn-4',
    menteeId: 'mentee-1',
    mentorId: 'mentor-5',
    status: 'accepted',
    createdAt: '2024-11-10T11:00:00Z',
    updatedAt: '2024-11-10T14:00:00Z',
    message: 'Hi Vikram! Need help with Physics for JEE. Your profile mentions you\'re great at it!'
  }
];

// Sample Chat Messages
export const sampleChatMessages: ChatMessage[] = [
  // Conversation between mentee-1 and mentor-1
  {
    id: 'msg-1',
    connectionId: 'conn-1',
    senderId: 'mentee-1',
    text: 'Hi Arjun! Thanks for accepting my request. I\'m really struggling with Physics, especially mechanics.',
    createdAt: '2024-11-01T12:30:00Z',
    read: true
  },
  {
    id: 'msg-2',
    connectionId: 'conn-1',
    senderId: 'mentor-1',
    text: 'Hey Ravi! Happy to help. Mechanics is all about understanding FBDs and energy conservation. What specific topics are giving you trouble?',
    createdAt: '2024-11-01T12:45:00Z',
    read: true
  },
  {
    id: 'msg-3',
    connectionId: 'conn-1',
    senderId: 'mentee-1',
    text: 'Rotation and SHM are the worst for me. I can\'t seem to understand when to use which formula.',
    createdAt: '2024-11-01T13:00:00Z',
    read: true
  },
  {
    id: 'msg-4',
    connectionId: 'conn-1',
    senderId: 'mentor-1',
    text: 'I totally understand! For rotation, always start by identifying the axis and calculating moment of inertia. For SHM, recognize it through the restoring force proportional to displacement. Want me to share some resources?',
    createdAt: '2024-11-01T13:15:00Z',
    read: true
  },
  // Conversation between mentee-2 and mentor-2
  {
    id: 'msg-5',
    connectionId: 'conn-2',
    senderId: 'mentee-2',
    text: 'Hello Dr. Priya! I\'m so grateful you accepted. Being a first-gen student, I have no one to guide me.',
    createdAt: '2024-11-05T16:30:00Z',
    read: true
  },
  {
    id: 'msg-6',
    connectionId: 'conn-2',
    senderId: 'mentor-2',
    text: 'Hi Neha! I completely understand - I was in the same boat. Don\'t worry, we\'ll figure this out together. What\'s your current preparation level?',
    createdAt: '2024-11-05T17:00:00Z',
    read: true
  },
  {
    id: 'msg-7',
    connectionId: 'conn-2',
    senderId: 'mentee-2',
    text: 'I\'ve finished NCERT once but not sure if that\'s enough. Biology is okay but Physics and Chemistry are difficult.',
    createdAt: '2024-11-05T17:15:00Z',
    read: false
  }
];

// Sample Community Threads
export const sampleCommunityThreads: CommunityThread[] = [
  {
    id: 'thread-1',
    authorId: 'mentee-1',
    title: 'How to manage JEE preparation with school boards?',
    content: 'I\'m in Class 12 and finding it really hard to balance JEE prep with board exams. My school has lots of practicals and projects. Any tips from seniors who\'ve been through this?',
    category: 'Exams',
    upvotes: 24,
    upvotedBy: ['mentee-2', 'mentee-3', 'mentor-1', 'mentor-5'],
    downvotes: 0,
    downvotedBy: [],
    likes: 5,
    likedBy: ['mentee-1', 'mentee-2', 'mentor-1', 'mentor-5', 'mentor-11'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-10T10:00:00Z'
  },
  {
    id: 'thread-2',
    authorId: 'mentee-2',
    title: 'Is NCERT really enough for NEET Biology?',
    content: 'Everyone says NCERT is the bible for NEET Bio, but I see coaching materials covering so much more. Seniors who cracked NEET - did you stick to NCERT or use other books too?',
    category: 'Exams',
    upvotes: 31,
    upvotedBy: ['mentee-1', 'mentor-2', 'mentor-8', 'mentor-14'],
    downvotes: 0,
    downvotedBy: [],
    likes: 8,
    likedBy: ['mentee-1', 'mentee-2', 'mentee-3', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-5', 'mentor-1'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-12T14:00:00Z'
  },
  {
    id: 'thread-3',
    authorId: 'mentee-3',
    title: 'CLAT vs other law entrances - which to focus on?',
    content: 'There are so many law entrance exams - CLAT, AILET, SLAT, LSAT. Should I prepare for all or focus on just CLAT? How different are they?',
    category: 'Admissions',
    upvotes: 18,
    upvotedBy: ['mentor-3', 'mentor-10'],
    downvotes: 0,
    downvotedBy: [],
    likes: 4,
    likedBy: ['mentee-3', 'mentor-3', 'mentor-10', 'mentor-4'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-15T09:00:00Z'
  },
  {
    id: 'thread-4',
    authorId: 'mentor-6',
    title: '[Guide] Cracking JEE without expensive coaching',
    content: 'As someone who cracked JEE Main (99.2%ile) without coaching, I want to share my strategy:\n\n1. YouTube is your best friend - PhysicsWallah, Unacademy free content\n2. NCERT first, always\n3. PYQs are gold - solve 10 years at least\n4. Join free Telegram groups for doubts\n5. Mock tests from Allen/Resonance (free ones available)\n\nAMA in comments!',
    category: 'Exams',
    upvotes: 156,
    upvotedBy: ['mentee-1', 'mentee-2', 'mentor-1', 'mentor-5', 'mentor-11'],
    downvotes: 0,
    downvotedBy: [],
    likes: 28,
    likedBy: ['mentee-1', 'mentee-2', 'mentee-3', 'mentor-1', 'mentor-5', 'mentor-11', 'mentor-6', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-3', 'mentor-4', 'mentor-7', 'mentor-10', 'mentor-9', 'mentor-12', 'mentor-13', 'mentor-15', 'mentor-16', 'mentor-17', 'mentor-18', 'mentor-19', 'mentor-20', 'mentee-4', 'mentee-5', 'mentee-6', 'mentee-7', 'mentee-8'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-08T16:00:00Z'
  },
  {
    id: 'thread-5',
    authorId: 'mentor-2',
    title: '[NEET 2024] Important topics to focus on in last 3 months',
    content: 'Based on recent trends and my experience, here are high-yield topics:\n\nBiology: Genetics, Ecology, Human Physiology\nPhysics: Optics, Modern Physics, Mechanics\nChemistry: Organic reactions, p-block, Thermodynamics\n\nPrioritize these if short on time!',
    category: 'Exams',
    upvotes: 89,
    upvotedBy: ['mentee-2', 'mentor-8', 'mentor-14'],
    downvotes: 0,
    downvotedBy: [],
    likes: 15,
    likedBy: ['mentee-2', 'mentee-3', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-1', 'mentor-5', 'mentor-6', 'mentor-3', 'mentor-4', 'mentor-7', 'mentor-11', 'mentor-9', 'mentor-10', 'mentor-12'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-18T11:00:00Z'
  },
  {
    id: 'thread-6',
    authorId: 'mentee-1',
    title: 'What is hostel life really like at IITs?',
    content: 'I\'ve heard so many things about IIT hostel life - both good and scary. Can IITians share what a typical day looks like? Is ragging still a thing? How\'s the food?',
    category: 'Campus Life',
    upvotes: 42,
    upvotedBy: ['mentee-2', 'mentee-3', 'mentor-1', 'mentor-5', 'mentor-11'],
    downvotes: 0,
    downvotedBy: [],
    likes: 12,
    likedBy: ['mentee-1', 'mentee-2', 'mentee-3', 'mentor-1', 'mentor-5', 'mentor-11', 'mentor-6', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-3', 'mentor-4'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-20T13:00:00Z'
  },
  {
    id: 'thread-7',
    authorId: 'mentor-7',
    title: 'IPMAT vs CAT later - which path is better for MBA?',
    content: 'Many students ask me this. Here\'s my take:\n\nIPMAT (5-year integrated):\n+ Guaranteed IIM tag\n+ No CAT stress later\n- Less work experience\n\nCAT after graduation:\n+ Work experience valued\n+ More mature decision\n- Highly competitive\n\nBoth are valid paths!',
    category: 'Careers',
    upvotes: 67,
    upvotedBy: ['mentee-3', 'mentor-4'],
    downvotes: 0,
    downvotedBy: [],
    likes: 9,
    likedBy: ['mentee-3', 'mentor-4', 'mentor-7', 'mentor-1', 'mentor-5', 'mentor-11', 'mentor-6', 'mentor-2', 'mentor-8'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-16T15:00:00Z'
  },
  {
    id: 'thread-8',
    authorId: 'mentee-2',
    title: 'Scholarships for medical students - complete list?',
    content: 'Does anyone have a comprehensive list of scholarships available for MBBS students? I\'m from an economically weaker background and fees are a concern.',
    category: 'Scholarships',
    upvotes: 38,
    upvotedBy: ['mentor-2', 'mentor-8'],
    downvotes: 0,
    downvotedBy: [],
    likes: 10,
    likedBy: ['mentee-2', 'mentee-3', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-1', 'mentor-5', 'mentor-6', 'mentor-3', 'mentor-4'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-19T10:00:00Z'
  }
];

// Sample Community Answers
export const sampleCommunityAnswers: CommunityAnswer[] = [
  {
    id: 'ans-1',
    threadId: 'thread-1',
    authorId: 'mentor-1',
    content: 'Great question! I faced the same. My tip: Board syllabus overlaps with JEE significantly. Focus on NCERT deeply - it covers boards AND builds JEE foundation. For advanced JEE topics, dedicate weekends. Don\'t stress - boards are more predictable!',
    isMentorAnswer: true,
    upvotes: 18,
    upvotedBy: ['mentee-1', 'mentee-2'],
    downvotes: 0,
    downvotedBy: [],
    likes: 7,
    likedBy: ['mentee-1', 'mentee-2', 'mentee-3', 'mentor-1', 'mentor-5', 'mentor-6', 'mentor-11'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-10T12:00:00Z'
  },
  {
    id: 'ans-2',
    threadId: 'thread-1',
    authorId: 'mentor-5',
    content: 'Adding to what Arjun said - create a priority matrix. High JEE+Board weightage topics first, then JEE-only, then Board-only. This way you\'re always preparing for both!',
    isMentorAnswer: true,
    upvotes: 12,
    upvotedBy: ['mentee-1'],
    downvotes: 0,
    downvotedBy: [],
    likes: 5,
    likedBy: ['mentee-1', 'mentee-2', 'mentor-1', 'mentor-5', 'mentor-6'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-10T14:00:00Z'
  },
  {
    id: 'ans-3',
    threadId: 'thread-2',
    authorId: 'mentor-2',
    content: 'NCERT is 80% of NEET Biology, literally. I scored 355/360 with just NCERT. The trick? Read it line-by-line, understand diagrams, memorize tables. For remaining 20%, MTG or Trueman\'s for AIIMS-level questions only if you\'re aiming for top 100.',
    isMentorAnswer: true,
    upvotes: 28,
    upvotedBy: ['mentee-2', 'mentor-8'],
    downvotes: 0,
    downvotedBy: [],
    likes: 11,
    likedBy: ['mentee-2', 'mentee-3', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-1', 'mentor-5', 'mentor-6', 'mentor-3', 'mentor-11', 'mentor-4'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-12T16:00:00Z'
  },
  {
    id: 'ans-4',
    threadId: 'thread-3',
    authorId: 'mentor-3',
    content: 'Focus 80% on CLAT - it\'s the gateway to most top NLUs. AILET has similar pattern but trickier. LSAT India is very different (logical reasoning heavy). My advice: Master CLAT prep, then do 2-3 AILET mocks in last month. Don\'t spread too thin!',
    isMentorAnswer: true,
    upvotes: 15,
    upvotedBy: ['mentee-3'],
    downvotes: 0,
    downvotedBy: [],
    likes: 6,
    likedBy: ['mentee-3', 'mentor-3', 'mentor-10', 'mentor-4', 'mentor-1', 'mentor-5'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-15T11:00:00Z'
  },
  {
    id: 'ans-5',
    threadId: 'thread-6',
    authorId: 'mentor-11',
    content: 'IIT hostel life is amazing! Typical day: Classes 8-5, then clubs/sports 5-8, dinner 8-9, studies 9-12+. Food varies by mess but generally decent. Ragging is officially banned and strictly monitored - I experienced zero issues. Night canteens, late-night coding sessions, and lifelong friendships are real!',
    isMentorAnswer: true,
    upvotes: 22,
    upvotedBy: ['mentee-1', 'mentee-2', 'mentor-1'],
    downvotes: 0,
    downvotedBy: [],
    likes: 13,
    likedBy: ['mentee-1', 'mentee-2', 'mentee-3', 'mentor-1', 'mentor-5', 'mentor-11', 'mentor-6', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-3', 'mentor-4', 'mentor-7'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-20T15:00:00Z'
  },
  {
    id: 'ans-6',
    threadId: 'thread-8',
    authorId: 'mentor-2',
    content: 'Here\'s what I know:\n1. Central Sector Scheme - ₹20,000/year for top 20% in boards\n2. State scholarships - check your state portal\n3. College-specific - AIIMS has free education!\n4. Private: Aditya Birla, Tata Trust, Narotam Sekhsaria\n5. Post-MBBS: Many hospitals offer bonds with stipends\n\nDon\'t let finances stop you!',
    isMentorAnswer: true,
    upvotes: 25,
    upvotedBy: ['mentee-2', 'mentor-8'],
    downvotes: 0,
    downvotedBy: [],
    likes: 8,
    likedBy: ['mentee-2', 'mentee-3', 'mentor-2', 'mentor-8', 'mentor-14', 'mentor-1', 'mentor-5', 'mentor-6'],
    dislikes: 0,
    dislikedBy: [],
    createdAt: '2024-11-19T12:00:00Z'
  }
];

// Verification Requests (for admin)
export const sampleVerificationRequests: VerificationRequest[] = [
  {
    id: 'ver-1',
    mentorId: 'mentor-14',
    status: 'pending',
    documents: ['/docs/mentor-14-college-id.pdf', '/docs/mentor-14-admit-card.pdf'],
    notes: 'Submitted college ID and NEET admit card',
    createdAt: '2024-11-22T10:00:00Z'
  },
  {
    id: 'ver-2',
    mentorId: 'mentor-2',
    status: 'verified',
    documents: ['/docs/mentor-2-college-id.pdf'],
    notes: 'Verified AIIMS student ID',
    createdAt: '2024-05-20T08:00:00Z',
    reviewedAt: '2024-05-21T14:00:00Z',
    reviewedBy: 'admin-1'
  }
];

// Sample Reports (for admin)
export const sampleReports: AdminReport[] = [
  {
    id: 'report-1',
    reporterId: 'mentee-1',
    reportedUserId: 'mentor-99',
    reason: 'Spam',
    description: 'This mentor keeps sending promotional messages about paid coaching.',
    evidenceUrls: [],
    status: 'resolved',
    resolutionNotes: 'Warning sent to mentor. Repeat offense will result in ban.',
    createdAt: '2024-11-15T09:00:00Z',
    resolvedAt: '2024-11-16T11:00:00Z'
  }
];

// Colleges list for autocomplete
export const collegesList = [
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'IIT Kanpur',
  'IIT Kharagpur',
  'IIT Roorkee',
  'IIT Guwahati',
  'IIT Hyderabad',
  'IIT BHU Varanasi',
  'IIT Indore',
  'IIT Patna',
  'IIT Gandhinagar',
  'IIT Jodhpur',
  'IIT Ropar',
  'IIT Bhubaneswar',
  'IIT Mandi',
  'IIT Tirupati',
  'IIT Palakkad',
  'IIT Dharwad',
  'IIT Bhilai',
  'IIT Goa',
  'IIT Jammu',
  'NIT Trichy',
  'NIT Warangal',
  'NIT Surathkal',
  'NIT Rourkela',
  'NIT Calicut',
  'NIT Kurukshetra',
  'NIT Durgapur',
  'NIT Allahabad',
  'NIT Jaipur',
  'NIT Nagpur',
  'BITS Pilani',
  'BITS Goa',
  'BITS Hyderabad',
  'AIIMS Delhi',
  'AIIMS Jodhpur',
  'AIIMS Bhopal',
  'AIIMS Patna',
  'AIIMS Raipur',
  'AIIMS Rishikesh',
  'JIPMER Puducherry',
  'CMC Vellore',
  'AFMC Pune',
  'NLSIU Bangalore',
  'NLU Delhi',
  'NALSAR Hyderabad',
  'NLU Jodhpur',
  'NUJS Kolkata',
  'GNLU Gandhinagar',
  'NLU Lucknow',
  'IIM Ahmedabad',
  'IIM Bangalore',
  'IIM Calcutta',
  'IIM Lucknow',
  'IIM Indore',
  'IIM Kozhikode'
];

// Exams list
export const examsList = [
  'JEE Main',
  'JEE Advanced',
  'NEET',
  'CLAT',
  'AILET',
  'BITSAT',
  'CUET',
  'IPMAT',
  'VITEEE',
  'SRMJEEE',
  'WBJEE',
  'MHT CET',
  'KCET',
  'AP EAMCET',
  'TS EAMCET'
];

// Topics list
export const topicsList = [
  'JEE Main',
  'JEE Advanced',
  'NEET',
  'CLAT',
  'BITSAT',
  'IPMAT',
  'CUET',
  'Campus Life',
  'Admissions',
  'Scholarships',
  'Internships',
  'Placements',
  'Study Tips',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Legal Reasoning',
  'Coding',
  'Research',
  'Higher Studies',
  'MBA',
  'GATE',
  'Government Jobs',
  'Startups'
];

// Languages list
export const languagesList = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Malayalam',
  'Marathi',
  'Gujarati',
  'Bengali',
  'Punjabi',
  'Odia',
  'Assamese',
  'Rajasthani',
  'Urdu'
];

// Indian states list
export const statesList = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Puducherry'
];

// Category colors for community
export const categoryColors: Record<string, string> = {
  'Admissions': 'bg-blue-100 text-blue-800',
  'Exams': 'bg-green-100 text-green-800',
  'Campus Life': 'bg-purple-100 text-purple-800',
  'Scholarships': 'bg-yellow-100 text-yellow-800',
  'Careers': 'bg-orange-100 text-orange-800'
};
