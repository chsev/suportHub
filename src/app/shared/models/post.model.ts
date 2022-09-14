import { Timestamp } from 'firebase/firestore';

export interface Post{
    id?: string,
    usrId: string,
    title: string,
    type: 'companyPost' | 'teamPost',
    teamId?: string,
    created?: Timestamp,
    modified?: Timestamp,
    tags: string[];
    liked: string[],
    viewed?: number
}