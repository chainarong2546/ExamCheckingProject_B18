import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 16);
}

export async function comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
}
