export interface ApiResponseGetMiPerfil {
    statusCode: number;
    message: string;
    data: MiPerfil;
    error?: string;
}

export interface MiPerfil {
    id: number;
    firstName: string;
    lastName: string;
    docNumber: string;
    phone: string;
    description: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    categoryId: number;
    categoryName: string;
    status: boolean;
}