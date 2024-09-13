import { Component, inject, OnInit } from '@angular/core';
import { AdvisorService } from '../../services/advisor.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { finalize, Subscription, tap } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-modal-create',
  templateUrl: './modal-create.component.html',
  styleUrls: ['./modal-create.component.css'],
})
export class ModalCreateComponent {
  private fb: FormBuilder = inject(FormBuilder);

  public formAdvisorCreate: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  passwordRandom: string = '';
  loading: boolean = false;
  allAdvisors: any;

  constructor(
    private modalService: ModalService,
    private advisorService: AdvisorService,
    private alertsService: AlertsService
  ) {}

  get name() {
    return this.formAdvisorCreate.get('name') as FormControl;
  }
  get lastname() {
    return this.formAdvisorCreate.get('lastname') as FormControl;
  }
  get email() {
    return this.formAdvisorCreate.get('email') as FormControl;
  }
  get password() {
    return this.formAdvisorCreate.get('password') as FormControl;
  }

  formEdit(): boolean {
    return this.formAdvisorCreate.valid;
  }

  ngOnInit(): void {}

  closeModal() {
    this.modalService.$modal.emit(false);
  }

  async getPasswordRandom() {
    this.passwordRandom = await this.advisorService.getPasswordRandom();
    this.formAdvisorCreate.get('password')?.setValue(this.passwordRandom);
  }

  create() {
    const formData = {
      name: this.name.value,
      lastName: this.lastname.value,
      email: this.email.value,
      password: this.password.value,
    };

    this.loading = true;
    this.advisorService
      .create(formData)
      .pipe(
        tap(() => {
          console.log(`asesor creado`);
        })
      )
      .subscribe(
        () => {
          this.alertsService.toast('Asesor creado correctamente', 'success');
          this.closeModal();
        },
        (error) => {
          console.error('Error al crear el Asesor:', error);
          this.alertsService.toast('El Asesor no se pudo crear', 'error');
        }
      );
  }
}
