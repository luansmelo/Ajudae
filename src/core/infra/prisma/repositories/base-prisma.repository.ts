export abstract class BasePrismaRepository<TDomain, TModel> {
    protected constructor(
        protected readonly prismaModel: {
            create: (args: any) => Promise<TModel>
            findUnique: (args: any) => Promise<TModel | null>
            findMany: (args?: any) => Promise<TModel[]>
            update: (args: any) => Promise<TModel>
            delete: (args: any) => Promise<TModel>
            deleteMany?: (args: any) => Promise<any>
        },
        protected readonly toEntity: (model: TModel) => TDomain,
        protected readonly toPrisma: (domain: TDomain) => any
    ) { }

    async create(domain: TDomain): Promise<TDomain> {
        const model = await this.prismaModel.create({ data: this.toPrisma(domain) });
        return this.toEntity(model);
    }

    async findById(id: string | number): Promise<TDomain | null> {
        const model = await this.prismaModel.findUnique({ where: { id } });
        return model ? this.toEntity(model) : null;
    }

    async findAll(): Promise<TDomain[]> {
        const models = await this.prismaModel.findMany();
        return models.map(this.toEntity);
    }

    async update(id: string | number, domain: TDomain): Promise<TDomain> {
        const model = await this.prismaModel.update({ where: { id }, data: this.toPrisma(domain) });
        return this.toEntity(model);
    }

    async delete(id: string | number): Promise<void> {
        await this.prismaModel.delete({ where: { id } });
    }
}
