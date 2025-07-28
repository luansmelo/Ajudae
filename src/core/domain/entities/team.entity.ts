export type TeamProps = {
  id?: number | null
  name: string
  createdAt?: Date
  updatedAt?: Date
}

export class Team {
  constructor(private readonly props: TeamProps) {}

  get id() {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }
}
