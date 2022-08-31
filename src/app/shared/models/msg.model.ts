export interface Msg{
    id?: string,
    usrId: string,
    type: 'original' | 'reply',
    created: string,
    content: string,
    upvote: string[],
    downvote: string[]
}