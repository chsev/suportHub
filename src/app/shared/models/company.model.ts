export interface Company {
    id?: string,
    name?: string,
    segment?: string,
    description?: string,
    administrators?: string[], 
    isOpen?: boolean,
    isPublic?: boolean,
    nMembers?: number,
    members?: string[],
}
