import * as bcrypt from 'bcrypt'
import { PasswordEncryptor } from 'src/core/domain/interfaces/password-encryptor.interface'
import { Injectable } from '@nestjs/common'
import { SALT_ROUNDS } from 'src/modules/auth/constants/constants'

@Injectable()
export class BcryptPasswordEncryptor implements PasswordEncryptor {
  async encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS)
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
