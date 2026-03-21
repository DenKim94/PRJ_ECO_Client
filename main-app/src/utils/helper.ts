export class HelperClass {
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isEqualPasswords(password: string, approvePassword: string): boolean {
        return password === approvePassword;
    }
}