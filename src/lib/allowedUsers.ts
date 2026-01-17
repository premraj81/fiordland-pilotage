export const ALLOWED_USERS = [
    "premraj81@gmail.com",
    "81prem@gmail.com",
    "billyjar87@gmail.com"
];

export function isUserAllowed(email: string): boolean {
    if (!email) return false;
    const normalizedEmail = email.toLowerCase().trim();
    return ALLOWED_USERS.some(u => u.toLowerCase().trim() === normalizedEmail);
}
