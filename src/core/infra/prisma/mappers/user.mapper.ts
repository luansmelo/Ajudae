import { Injectable } from "@nestjs/common";
import { User } from "src/core/domain/entities/user.entity";
import { CreateUserDTO } from "src/modules/user/dtos/create-user.dto";

@Injectable()
export class UserMapper {
    static toEntity(prismaData: any): User {
        return new User({
            id: prismaData.id,
            name: prismaData.name,
            email: prismaData.email,
            password: prismaData.password,
        })
    }

    static toPrisma(dto: CreateUserDTO): any {
        return {
            name: dto.name,
            email: dto.email,
            password: dto.password,
        };
    }
}