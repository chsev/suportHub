export interface Team {
    id?: string,
    name?: string,
    description?: string,
    companyId: string,
    members?: string[],
    waitingApproval?: string[],
    administrators?: string[],
    systems?: string[],
    isOpen?: boolean,
}