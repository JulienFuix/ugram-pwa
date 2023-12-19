export type Notifications = {
    id: string,
    type: string,
    text: string,
    viewed: boolean,
    createdAt: Date;
    updatedAt: Date;
    receiver_id: string,
    associate_user_id: string,
    publication_id: string,
};
