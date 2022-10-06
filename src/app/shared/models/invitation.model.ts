import { Timestamp } from 'firebase/firestore';

export interface Invitation{
    id?: string,
    userMail: string,
    companyId: string,
    status: 'open' | 'accepted' | 'refused' | 'expired',
    created?: Timestamp
}