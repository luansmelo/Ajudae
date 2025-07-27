import { User } from '../entities/user.entity'
import { BaseRepository } from '.'

export interface UserRepository extends BaseRepository<User> {
  emailExists(email: string): Promise<boolean>
  findByEmail(email: string): Promise<User | null>
  updateLastLogin(userId: number, lastLogin: Date): Promise<void>
}
