import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HouseService } from 'src/app/services/house.service';
import { House } from 'src/app/model/house';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';


@Component({
  selector: 'app-house',
  standalone: true,
  imports: [CommonModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastModule,
    FormsModule
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
  modoEdicao = false;
  casaEditando: House | null = null;
  houseForm!: FormGroup;
  emailUsuarioGuest: string = '';
  listaDeUsuarios: any[] = [];

  constructor(private fb: FormBuilder, private houseService: HouseService, private messageService: MessageService, private router: Router) {
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
      const houseData = new House(this.houseForm);

      if (this.modoEdicao && this.casaEditando) {
        houseData.id = this.casaEditando.id;
        this.houseService.update(houseData.id, houseData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Casa atualizada com sucesso!' });
            this.atualizarSessao();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Erro ao atualizar.' });
          },
        });
      } else {
        this.houseService.create(houseData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Casa cadastrada com sucesso!' });
            this.atualizarSessao();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Erro ao cadastrar.' });
          },
        });
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Inválido', detail: 'Dados inválidos' });
    }
  }

  editarCasa(casa: House) {
    this.cadastroAtivo = true;
    this.modoEdicao = true;
    this.casaEditando = casa;

    this.houseForm.patchValue({
      name: casa.name,
      cep: casa.cep,
      street: casa.street,
      number: casa.number,
      district: casa.district,
      city: casa.city,
      state: casa.state,
      country: casa.country
    });

    this.listaDeUsuarios = casa.users || [];
  }

  navegarParaEquipamentos(casa: any) {
    this.router.navigate(['pages/equipamentos/', casa.id]);
  }

  navegarParaRelatorios(casa: any) {
    this.router.navigate(['pages/relatorio/', casa.id]);
  }
  adicionarUsuario() {
    if (this.emailUsuarioGuest && this.casaEditando?.id) {
      this.houseService.addGuest(this.casaEditando.id, this.emailUsuarioGuest).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Usuário Adicionado', detail: 'Usuário adicionado com sucesso!' });
          this.emailUsuarioGuest = '';
          this.atualizarSessao();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Erro ao adicionar usuário.' });
        }
      });
    }
  }

  removerUsuario(email: string) {
    if (email && this.casaEditando?.id) {
      this.houseService.removeGuest(this.casaEditando.id, email).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Usuário Adicionado', detail: 'Usuário removido com sucesso!' });
          this.atualizarSessao();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err?.error?.message || 'Erro ao remover usuário.' });
        }
      });
    }
  }

  atualizarSessao() {
    this.finalizarCadastro()
    location.reload()
  }


  excluirCasa(casa: any) {
    this.houseService.delete(casa.id).subscribe({
      next: () => {
        this.houses = this.houses.filter(h => h.id !== casa.id);
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Casa excluída com sucesso!' });
        this.atualizarSessao();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir casa.' });
      }
    });
  }

  iniciarCadastro() {
    this.cadastroAtivo = true;
  }

  finalizarCadastro() {
    this.cadastroAtivo = false;
    this.modoEdicao = false;
    this.casaEditando = null;
    this.houseForm.reset();
  }
}
