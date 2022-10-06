import { Timestamp } from "firebase/firestore";

export interface System {
    id?: string,
    created?: Timestamp
    companyId: string
    teamId: string;
    name?: string,
    description?: string,
    nDocs?: number
}
