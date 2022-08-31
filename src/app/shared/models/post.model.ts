export interface Post{
    id?: string,
    usrId: string,
    title: string,
    type: 'companyPost' | 'teamPost',
    teamId?: string,
    created: string,
    liked: string[],
    viewed: string[]
}