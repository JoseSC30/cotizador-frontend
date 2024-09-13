import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';
import { UserRegister } from '../../interfaces/user.interface';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  
  public registerForm!: FormGroup;
  public loading: boolean = false;
  
  constructor(
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
    private fb: FormBuilder,
    private router: Router,
  ) { }
  
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
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
            Validators.minLength(6),
            Validators.maxLength(50),
            CustomValidators.passwordComplexity,
          ],
        ],
        repeatPassword: ['', [Validators.required]],
      },
      {
        validators: [
          CustomValidators.mustBeEqual(
            'password',
            'repeatPassword'
          ),
        ],
      }
    );
  }
  
  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    
    const formData = this.registerForm.value;
    const user: UserRegister = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }
    
    this.authService.register(user)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {
          this.alertsService.toast('Usuario registrado con éxito', 'success');
          this.router.navigate(['/auth/login']);
        },
        error: (errorMessage) => {
          this.alertsService.toast(errorMessage, 'error');
          console.error('Error en el registro:', errorMessage);
        },
      });
  }
  
  isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.registerForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.registerForm, field);
  }

}
