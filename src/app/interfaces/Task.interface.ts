export interface ApiResponseListTasksAssignsToPatientI {
    statusCode: number;
    message: string;
    data: TaskDetailAssignToPatientI[];
    error?:string;
}

export interface TaskDetailAssignToPatientI {
    id: number;
    createdAt: string;
    dueDate: string;
    isCompleted: boolean;
    task: {
        id: number;
        title: string;
        description: string;
        estimatedTime: number;
    }
}

export interface ApiResponseListTaskDetail {
    statusCode: number;
    message: string;
    data: TaskDetail;
    error?:string;
}

export interface TaskDetail {
    assignmentId:number;
    taskId:number;
    title:string;
    description:string;
    estimatedTime:number;
    isCompleted:boolean;
    createdAt:string;
    dueDate:string;
    files: Files[];
}
export interface Files{
    id:number;
    url:string;
    title:string;
    type:string;
}

export interface FilesToView{
    type:string;
    url:any;
}