import { Role } from "../role/role.enum";
export declare class CreateUserDto {
    name: string;
    referral: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
    homeAddress?: string;
    accountNumber?: string;
    bankName?: string;
    accountName?: string;
    cityOfResidence?: string;
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
    cacRegistration?: string;
    businessLocation?: string;
}
export declare class UpdateUserDto {
    name: string;
    phone: string;
    role: Role;
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
    cacRegistration?: string;
    businessLocation?: string;
    homeAddress?: string;
    cityOfResidence?: string;
}
