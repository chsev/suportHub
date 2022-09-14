export interface Company {
    id?: string,
    name?: string,
    segment?: string,
    description?: string,
    isOpen?: boolean,
    isPublic?: boolean,
    nMembers?: number,
    members?: string[],
    administrators?: string[], 
    waitingApproval?: string[]
}
