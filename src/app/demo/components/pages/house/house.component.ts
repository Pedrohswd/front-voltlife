import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-house',
  standalone: true,
  imports: [		CommonModule,
		InputTextModule,
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './house.component.html',
  styleUrl: './house.component.scss'
})
export class HouseComponent implements OnInit{
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

  enderecoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.enderecoForm = this.fb.group({
      nome: [''],
      cep: [''],
      street: [''],
      number: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      pais: [''],
    });
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
