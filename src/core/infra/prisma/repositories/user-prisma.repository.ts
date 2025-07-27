import { UserRepository } from "../../../domain/repositories/user.repository";
import { User } from "src/core/domain/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { UserMapper } from "src/core/infra/prisma/mappers/user.mapper";
import { BasePrismaRepository } from "./base-prisma.repository";
import { User as UserModel } from '@prisma/client'
import { PrismaService } from "../provider/prisma.provider";

@Injectable()
export class PrismaUserRepository extends BasePrismaRepository<User, UserModel>
    implements UserRepository {

    constructor(prisma: PrismaService) {
        super(prisma.user, UserMapper.toEntity, UserMapper.toPrisma);
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await this.prismaModel.findUnique({ where: { email } })
        return !!user
    }

    async create(data: User): Promise<User> {
        const userData = UserMapper.toPrisma(data);
        const user = await this.prismaModel.create({ data: userData });
        return UserMapper.toEntity(user);
    }

    async findById(id: number): Promise<User | null> {
        const user = await this.prismaModel.findUnique({ where: { id } });
        return UserMapper.toEntity(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prismaModel.findUnique({ where: { email } });
        return user ? UserMapper.toEntity(user) : null;
    }

    async update(id: string | number, data: User): Promise<User> {
        const userData = UserMapper.toPrisma(data);
        const user = await this.prismaModel.update({
            where: { id: Number(id) },
            data: {
                ...userData,
                lastLogin: data.lastLogin ? new Date(data.lastLogin) : undefined
            }
        });
        return UserMapper.toEntity(user);
    }

    async updateLastLogin(userId: number, lastLogin: Date): Promise<void> {
        await this.prismaModel.update({
            where: { id: userId },
            data: { lastLogin }
        });
    }
}
