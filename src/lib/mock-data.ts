export type AcademicRecord = {
  id: string;
  course: string;
  grade: string;
  year: number;
  institution: string;
  verified: boolean;
  transactionId: string;
};

export type User = {
  studentId: string;
  name: string;
  walletAddress: string;
  role: 'student' | 'admin';
  records: AcademicRecord[];
};

export const ADMIN_WALLET = 'SP2J6B0D5R0D2Q5BFA05NK8338G48YV319VFEF34B';
export const STUDENT_WALLET_1 = 'ST2J6B0D5R0D2Q5BFA05NK8338G48YV319VFEFABC';
export const STUDENT_WALLET_2 = 'ST3J6B0D5R0D2Q5BFA05NK8338G48YV319VFEFXYZ';

export const users: User[] = [
  {
    studentId: 'ADMIN-001',
    name: 'School Administrator',
    walletAddress: ADMIN_WALLET,
    role: 'admin',
    records: [],
  },
  {
    studentId: 'STU-2024-001',
    name: 'Alice Johnson',
    walletAddress: STUDENT_WALLET_1,
    role: 'student',
    records: [
      {
        id: 'REC-001',
        course: 'Blockchain Fundamentals',
        grade: 'A+',
        year: 2023,
        institution: 'NextGen University',
        verified: true,
        transactionId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
      },
      {
        id: 'REC-002',
        course: 'Clarity Smart Contracts',
        grade: 'A',
        year: 2023,
        institution: 'NextGen University',
        verified: true,
        transactionId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
      },
      {
        id: 'REC-003',
        course: 'Decentralized Applications',
        grade: 'B+',
        year: 2024,
        institution: 'NextGen University',
        verified: false,
        transactionId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
      },
    ],
  },
  {
    studentId: 'STU-2024-002',
    name: 'Bob Williams',
    walletAddress: STUDENT_WALLET_2,
    role: 'student',
    records: [
        {
            id: 'REC-004',
            course: 'Introduction to Cryptography',
            grade: 'A',
            year: 2022,
            institution: 'Tech Institute',
            verified: true,
            transactionId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
        },
        {
            id: 'REC-005',
            course: 'Data Structures',
            grade: 'B',
            year: 2023,
            institution: 'Tech Institute',
            verified: true,
            transactionId: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random()*16).toString(16)).join(''),
        },
    ],
  },
];

export const findUserByWallet = (walletAddress: string): User | undefined => {
    return users.find(u => u.walletAddress === walletAddress);
}

export const findUserById = (studentId: string): User | undefined => {
  return users.find(u => u.studentId.toLowerCase() === studentId.toLowerCase());
}
