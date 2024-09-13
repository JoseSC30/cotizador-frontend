import { Component, inject,OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AdvisorService } from '../../services/advisor.service';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['../modal-create/modal-create.component.css',
              './modal-edit.component.css']
})

export class ModalEditComponent {

  public subscription: Subscription;
 
  loading: boolean = false;
  advisor: any;
  advisorId: any;
  allAdvisors:any;

  private fb: FormBuilder= inject(FormBuilder);

  public formAdvisorEdit: FormGroup= this.fb.group({
    name: ["",Validators.required],
    lastname: ["",Validators.required],
    email:  ["",Validators.required],
  });

  constructor(
    private modalService: ModalService,
    private advisorService: AdvisorService,
    private alertsService: AlertsService,
    ){
    this.subscription = this.modalService.getData().subscribe(data => {
      this.advisor = data; 
    });           
  }

  get name(){return this.formAdvisorEdit.get('name') as FormControl}
  get lastname(){return this.formAdvisorEdit.get('lastname') as FormControl}
  get email(){return this.formAdvisorEdit.get('email') as FormControl}

  ngOnInit(): void {
    this.modalService.$modal.subscribe((value)=> {this.advisor = value});  
    this.advisorId= this.advisor.id 
    this.formAdvisorEdit.patchValue({
      name: this.advisor.name,
      lastname: this.advisor.lastname,
      email: this.advisor.email,
    }); 
  }

  formEdit(): boolean {
    return this.formAdvisorEdit.dirty;
  }

  closeModal(){
    this.modalService.$modalEdit.emit(false);
  }

  async edit(){
    const AdviserData= {
      name:this.name.value,
      lastName: this.lastname.value,
      email: this.email.value
    }
    this.advisorService.updateAdvisor(this.advisorId, AdviserData)
    .pipe(finalize(() => (this.loading = false))) 
    .subscribe( 
      ()=>{
        this.alertsService.toast('Asesor actualizado', 'info');
        this.closeModal();
      },
      error => {
        console.error('Error al actualizar el Asesor:', error);
        this.alertsService.toast('El Asesor no se pudo actualizar', 'error');
      }
    )
  }

  updateAdvisorsList() {
    this.advisorService.getAllAdvisors().subscribe({
      next: (advisors) => {
        this.allAdvisors = advisors; // Asignar la lista de asesores actualizada
      },
      error: (err) => {
        this.alertsService.toast('Error al obtener la lista de asesores', 'error');
      }
    });
  }
}
