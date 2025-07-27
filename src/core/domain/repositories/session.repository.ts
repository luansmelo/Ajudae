import { Session } from '../entities/session.entity';

export interface SessionRepository {
    create(session: Session): Promise<void>;
    findByToken(token: string): Promise<Session | null>;
    findByUserId(userId: number): Promise<Session | null>;
    revokeToken(token: string): Promise<void>;
    revokeAll(userId: number): Promise<void>;
    update(session: Session): Promise<void>;
}
