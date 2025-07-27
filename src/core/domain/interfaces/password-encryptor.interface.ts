export interface PasswordEncryptor {
  encrypt(password: string): Promise<string>
  comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>
}
