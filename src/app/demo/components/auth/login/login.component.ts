import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent {

	email: string = '';
	password: string = '';
	errorMessage: string = '';
	loading = false;
  
	constructor(
	  private authService: AuthService,
	  private router: Router,
	  public layoutService: LayoutService
	) {}
  
	login(): void {
	  this.authService.login(this.email, this.password).subscribe(
		(response) => {
		  const token = response.token;  // Esperando a resposta com o token JWT
		  if (token) {
			console.log('Autenticado com sucesso!');
			this.router.navigate(['../']);
		  }
		},
		(error) => {
		  this.errorMessage = 'Falha na autenticação. Verifique suas credenciais.';
		  console.error('Erro de autenticação', error);
		}
	  );
	}
  
	navigateTo(route: string) {
	  this.router.navigate([route]);
	}

	get filledInput(): boolean {
		return this.layoutService.config().inputStyle === 'filled';
	}

}
