export interface ApiResponseListNotificationsI {
    statusCode: number;
    message: string;
    data: NotificationI[];
    error?:string;
}

export interface NotificationI{
    id:number;
    title:string;
    body:string;
    createdAt:string;
    updatedAt:string;
    status:boolean;
}