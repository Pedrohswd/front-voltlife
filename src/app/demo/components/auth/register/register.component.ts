import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from 'src/app/services/user.service';

@Component({
	templateUrl: './register.component.html'
})
export class RegisterComponent {
	userForm: FormGroup
	errorMessage: string = '';
	loading = false;
  
	constructor(
	  private userService: UserService,
	  private router: Router,
	  public layoutService: LayoutService,
	  private fb: FormBuilder
	) {
	  this.userForm = this.fb.group({
		name: ['', [Validators.required]],
		email: ['', [Validators.required]],
		password: ['', [Validators.required]],
		date: ['', [Validators.required]],
		role: ['USER']
	  }, {
	  });
	}
  
	cadastre(): void {
	  this.userService.register(this.userForm.value).subscribe({
		next: () => {
		  this.router.navigate(['./auth/login']);
		},
		error: (error) => {
		  this.loading = false;
		}
	  });
	}
  
	navigateTo(route: string) {
	  this.router.navigate([route]);
	}

	get filledInput(): boolean {
		return this.layoutService.config().inputStyle === 'filled';
	}

}
