import { auth } from "@clerk/nextjs/server";

export type RoleType = string | undefined;
type AuthResult = {
    role: RoleType;
    currentUserId: string | null;
};

export async function getUserRole(): Promise<AuthResult> {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    const currentUserId = userId
    return { role, currentUserId };
}