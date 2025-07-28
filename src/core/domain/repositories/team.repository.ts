import { BaseRepository } from '.'
import { Team } from '../entities/team.entity'

export interface TeamRepository extends BaseRepository<Team> {
  findByName(name: string): Promise<Team | null>
}
