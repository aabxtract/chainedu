"use server";

import { generateVerificationLink as genLink } from "@/ai/flows/verification-link-generation";
import { findUserById, findUserByWallet } from "@/lib/mock-data";

export async function generateVerificationLink(studentId: string) {
  try {
    const result = await genLink({ studentId, expirationDays: 1 });
    return { success: true, link: result.verificationLink };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate link." };
  }
}

export async function verifyRecord(identifier: string) {
    try {
        let user = findUserById(identifier);
        if (!user) {
            user = findUserByWallet(identifier);
        }

        if (user) {
            // Return only verified records for public view
            const verifiedRecords = user.records.filter(r => r.verified);
            return { success: true, user: { name: user.name, studentId: user.studentId }, records: verifiedRecords };
        } else {
            return { success: false, error: "No student found with that ID or wallet address." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: "An error occurred during verification." };
    }
}
