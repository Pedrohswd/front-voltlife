import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HouseService } from 'src/app/services/house.service';
import { House } from 'src/app/model/house';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-house',
  standalone: true,
  imports: [CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './house.component.html',
  styleUrl: './house.component.scss'
})
export class HouseComponent implements OnInit {
  cadastroAtivo = false;

  casas = [
    {
      id: 1,
      nome: 'Casa Verde',
      endereco: 'Rua das Flores, 123',
      descricao: 'Casa moderna com jardim e garagem.',
      logoUrl: 'https://exemplo.com/logo-casa-verde.png'
    },
    {
      id: 2,
      nome: 'Casa Azul',
      endereco: 'Avenida Mar, 456',
      descricao: 'Casa com vista para o mar.',
      logoUrl: 'https://exemplo.com/logo-casa-azul.png'
    }
  ];
  houses: House[] = []


  houseForm!: FormGroup;

  constructor(private fb: FormBuilder, private houseService: HouseService, private messageService: MessageService) {
    this.houseForm = this.fb.group({
      name: ['', Validators.required],
      cep: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.houseService.getByUser().subscribe(data => {
      this.houses = data
    });
  }

  register() {
    if (this.houseForm.valid) {
      const newHouse = new House(this.houseForm);
      this.houseService.create(newHouse).subscribe({
        next: (data) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Casa cadastrada com sucesso!',
          });
          location.reload()
        },
        error: (err) => {
          console.error('Erro ao cadastrar casa:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error?.message || 'Ocorreu um erro ao cadastrar a casa.',
          });
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Inválido', detail: 'Dados inválidos' });
    }
  }

  editarCasa(casa: any) {
    // Lógica para editar
    console.log('Editar', casa);
  }

  excluirCasa(casa: any) {
    // Lógica para excluir
    console.log('Excluir', casa);
  }

  iniciarCadastro() {
    this.cadastroAtivo = true;
  }

  finalizarCadastro() {
    this.cadastroAtivo = false;
  }
}
