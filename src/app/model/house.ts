import { FormGroup } from "@angular/forms";
import { User } from "./user";

export class House {
    id?: number;
    name: string;
    cep: string;
    street: string;
    number: string;
    district: string;
    city: string;
    state: string;
    country: string;
    users?: HouseUser[];

    constructor(form: FormGroup) {
        this.name = form.get('name')?.value;
        this.cep = form.get('cep')?.value;
        this.street = form.get('street')?.value;
        this.number = form.get('number')?.value;
        this.district = form.get('district')?.value;
        this.city = form.get('city')?.value;
        this.state = form.get('state')?.value;
        this.country = form.get('country')?.value;
    }
}

export interface HouseUser {
    id: number;
    user: User;
    role: 'PROPRIETARIO' | 'CONVIDADO'; // ou outros valores que existirem
}