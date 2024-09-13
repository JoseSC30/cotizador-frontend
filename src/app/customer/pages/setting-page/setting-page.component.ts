import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCurrent } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { CustomerService } from '../../services/customer.service';
import { finalize } from 'rxjs';

const IMAGE_PREVIEW: string = './assets/avatars/user-profile.png';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css'],
})
export class SettingPageComponent implements OnInit {
  public settingsForm!: FormGroup;
  public user!: UserCurrent | null;
  public imagePreview!: string;
  public photo?: File;
  public loading: boolean = false;

  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private validatorsService: ValidatorsService,
    private alertsService: AlertsService,
    private fb: FormBuilder
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loadImagePreview();
    const gender = this.user?.profile.gender;
    this.settingsForm = this.fb.group({
      file: [null, [Validators.required]],
      gender: [gender],
    });
  }

  loadImagePreview(): void {
    this.imagePreview = this.user?.profile.photo || IMAGE_PREVIEW;
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    const id = this.user?.profile.id;
    const { gender } = this.settingsForm.value;
    if (!id && !this.photo) return;

    this.loading = true; // Habilitar estado de carga

    this.customerService
      .uploadProfile(id!, this.photo!, gender)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (resp) => {
          this.alertsService.toast('Perfil actualizado correctamente', 'success');
          this.authService.getUser().subscribe({
            next: (user) => {
              this.imagePreview = user.profile.photo;
            },
          });
        },
        error: (err) => {
          this.alertsService.toast('Error al actualizar el perfil', 'error');
        },
      });
  }
  
  onDeleteImage(): void {
    this.alertsService.showConfirmationDialog().then((confirmed) => {
      if (confirmed) {
        const id = this.user?.profile.id;
        if (!id) return;
        
        this.customerService
        .deleteProfileImage(id)
        .subscribe({
          next: () => {
            this.authService.getUser().subscribe({
              next: () => {
                this.imagePreview = IMAGE_PREVIEW;
              }
            });
            this.alertsService.toast('Imagen eliminada correctamente', 'success');
          },
          error: (err) => {
            console.log(err)
            this.alertsService.toast('La imagen no se pudo eliminar porque no existe', 'error')
          },
        });
      }
    })

    
  }
  
  onCancel(): void {
    this.settingsForm.reset();
    this.initForm();
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.photo = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
    }
  }

  isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.settingsForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.settingsForm, field);
  }
}
