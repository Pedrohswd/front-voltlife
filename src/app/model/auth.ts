export interface JwtResponse {
    token: string;
    type: string;
    username: string;
    roles: string[];
}