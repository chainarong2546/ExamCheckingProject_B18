import bcrypt from "bcrypt";

const salt_Size: number = 12;

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, salt_Size);
}

export async function comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
}
