import { Timestamp } from "firebase/firestore";

export interface Msg{
    id?: string,
    usrId: string,
    type: 'original' | 'reply',
    created?: Timestamp,
    content: string,
    upvote: string[],
    downvote: string[]
}