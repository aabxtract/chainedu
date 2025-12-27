# **App Name**: EduChain Records

## Core Features:

- Student Registration: Allow admins to register students by linking wallet addresses to student profiles using Clarity smart contracts on the Stacks blockchain.
- Record Addition/Update: Enable admins to add or update academic records (course, grade, year, institution) immutably on-chain.
- Student Record View: Allow students to view their academic records.
- Record Verification: Enable public or verified third parties (employers, institutions) to verify student records using a unique ID or wallet address.
- Wallet Authentication: Provide secure, wallet-based login (Hiro Wallet) for students to prove ownership and admins to manage records.
- Verification Link: Generate temporary, cryptographically signed links for employers/institutions that automatically expire after 24 hours. Requires integration with a smart contract tool on the blockchain.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust, security, and knowledge.
- Background color: Light blue (#E3F2FD) to create a clean and calming environment.
- Accent color: Soft orange (#FFAB40) to draw attention to important actions or data.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern, neutral look.
- Use simple, outlined icons to represent different sections or actions in the app. Match icons to UI type to allow user to rapidly orient to layout.
- Implement a clean and structured layout, separating concerns (Profile, Records, Verification) into dedicated tabs.
- Incorporate subtle animations on data updates and record verification to provide engaging feedback.