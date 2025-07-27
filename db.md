User:
    id(uuid)
    name(string)
    email(string)
    password(string)
    role(enum['ADMIN', 'ATTENDANT', 'USER'])
    createdAt(Date)
    updatedAt(Date)
    lastLogin(Date)

Team:
    id(uuid)
    name(string)                // Ex: 'Marketing', 'Produto', 'Financeiro'
    createdAt(Date)
    updatedAt(Date)

UserTeam:
    id(uuid)
    userId(uuid)                // FK → User.id
    teamId(uuid)                // FK → Team.id
    createdAt(Date)

Ticket:
    id(uuid)
    title(string)
    messages(TicketMessages)
    status(enum['Aberto', 'Fechado', 'Em andamento'])
    createdById(uuid)           // FK → User.id
    assignedToId(uuid | null)   // FK → User.id (responsável atual)
    teamId(uuid | null)         // FK → Team.id (para qual time está encaminhado)
    category(enum['Financeiro', 'Marketing', 'Suporte', 'Produto', 'Outro']) // NOVO
    priority(enum['Baixa', 'Média', 'Alta']) // opcional
    closedAt(Date | null)       // opcional
    createdAt(Date)
    updatedAt(Date)

TicketMessages:
    id(uuid)
    ticketId(uuid)              // FK → Ticket.id
    senderId(uuid)              // FK → User.id (quem enviou)
    message(text)
    isInternal(boolean)         // opcional: mensagem interna, visível só pela equipe
    attachmentUrl(string)       // opcional: URL de arquivo anexo
    createdAt(Date)
