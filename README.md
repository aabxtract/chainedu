🎓 Student Record App (Stacks Blockchain)

A decentralized student record management system built on the Stacks blockchain, designed to store and verify academic records immutably, securely, and transparently.

This project demonstrates how blockchain can replace paper-based and centralized academic record systems with a trustless, verifiable alternative.

🌍 Overview

Academic records are often:

Easy to forge

Hard to verify

Locked in centralized systems

Lost or damaged over time

This app uses blockchain technology to ensure that student records are:

Tamper-proof

Publicly verifiable

Owned by students

Controlled by authorized institutions

🧠 Core Idea

Store student academic records on-chain using Clarity smart contracts on the Stacks blockchain.

Each student is linked to a wallet address, and all academic records are:

Immutable (append-only)

Auditable

Verifiable by third parties

👤 User Roles
🏫 Admin (School Authority)

Register students

Add academic records

Update records (append-only)

Verify record authenticity

🎓 Student

View personal academic records

Prove ownership via wallet

Share verification details with third parties

🔍 Public / Verifier

Verify student records using:

Wallet address

Student ID

Read-only access to permitted data

⛓️ Blockchain Usage (Stacks)

The app uses Clarity smart contracts to:

Link student wallet addresses to student profiles

Store academic records (course, grade, year, institution)

Enforce strict access control

Prevent unauthorized edits or deletions

Key Guarantees

Only admins can add records

Records cannot be deleted

All changes are transparent and auditable on-chain

🧱 Smart Contract Features

Register student profiles

Add academic records

Fetch student records by wallet or ID

Verify record existence and authenticity

Role-based access control (admin vs student)

🎨 Frontend Experience

The frontend is designed to be simple, clean, and intuitive.

Student Dashboard

Profile

Academic Records

Verification

Authentication

Wallet-based login using Hiro Wallet

Public Verification Page

Employers and institutions can verify records

No wallet required for read-only access

🧠 Design Philosophy

Student-first

Trust-focused

Minimal complexity

Built for real-world adoption

Education + blockchain (no hype)

🚀 Tech Stack

Blockchain: Stacks

Smart Contracts: Clarity

Frontend: React / Next.js

Wallet: Hiro Wallet

Storage: On-chain records (optional hash references for documents)

📦 Use Cases

Universities & schools

Employers verifying credentials

Scholarship organizations

International record verification

Academic fraud prevention

🎯 Project Goal

To build a working prototype that proves blockchain can:

Secure academic records

Reduce credential fraud

Increase trust in educational systems

Give students ownership of their academic data

🧪 Deployment

Stacks Testnet

Deployed using Clarinet

Interacted with via Hiro Wallet

🌱 Future Improvements

Multiple institution admins

IPFS / off-chain document hashes

Student consent-based record sharing

Record revocation flags

Institution registry

UI analytics & audit logs

🏁 Hackathon Pitch Line

“This project replaces academic trust with verifiable truth on the blockchain.”

📄 License

MIT License