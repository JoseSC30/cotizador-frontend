import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  public loginForm!: FormGroup;
  public loading: boolean = false;
  public returnUrl: string | null = null;
  
  constructor(
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          CustomValidators.emailValid,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
        ],
      ],
    });
    
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }
  
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    
    const email = this.loginForm.value.email.trim();
    const password = this.loginForm.value.password.trim();
    
    this.authService.login(email, password)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: async (user) => {
          this.authService.setCurrentUser(user);
          const roles = user.roles;
          let selectedRole: string = roles[0];
          
          if (roles.length > 1) {
            selectedRole = await this.alertsService.showSelectRole(roles);
          }
          localStorage.setItem('role', selectedRole);
          
          this.authService.setCurrentRole(selectedRole);
          
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          } else {
            switch(selectedRole) {
              case 'user':
                this.router.navigate(['/dashboard/home']);
                break;
              case 'admin':
                this.router.navigate(['/home']);
                break;
              // case 'asesor':
              //   this.router.navigate(['/asesor']);
              //   break;
            }
          }
          this.alertsService.toast('Usuario autenticado con éxito', 'success');
        },
        error: (errorMessage) => {
          this.alertsService.toast(errorMessage, 'error');
        },
      });
  }
  
  isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.loginForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.loginForm, field);
  }
  
}
