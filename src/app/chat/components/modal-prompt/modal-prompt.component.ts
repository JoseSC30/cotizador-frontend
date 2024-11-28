import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { ChatService } from '../../services/chat.service';
import { lastValueFrom } from 'rxjs';
import { AlertsService } from 'src/app/shared/services/toast.service';
import { FORMAT_JSON } from '../../interfaces/prompt.utils';

@Component({
  selector: 'app-modal-prompt',
  templateUrl: './modal-prompt.component.html',
  styleUrls: ['./modal-prompt.component.css'],
})
export class ModalPromptComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  public loading: boolean = false;
  public isReady: boolean = false;
  public totalRequests: number = 0;
  public pendingRequests: number = 0;
  public limit: number = 10;

  public opcionesTipo: string[] = [];
  //public tipoHabitaciones!: string[];
  public tipoSillas!: string[];
  public tipoEscritorios!: string[];
  public tipoEstanterias!: string[];
  public tipoMesas!: string[];
  public tipoLabel!: string;

  public myForm!: FormGroup;

  public prompts: string[] = [];
  public resultPromptPresupuesto = '';
  public resultPromptsImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    private chatService: ChatService,
    private alertsService: AlertsService,
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      tipo: ['Silla', Validators.required],
      estilo: ['', Validators.required],
      tipoHabitacion: ['', Validators.required],
      ancho: ['', Validators.required],
      largo: ['', Validators.required],
      alto: ['', Validators.required],
      material: ['', Validators.required],
    });

    //this.tipoHabitaciones = [
      this.tipoSillas = [
      //'Dormitorio matrimonial',
      'Silla de comedor',
      'Silla de oficina',
      'Silla de jardin',
    ];

    this.tipoEscritorios = [
      'Escritorio para recepción',
      'Escritorio para ordenador',
      'Escritorio de estudio',
    ];
    
    this.tipoEstanterias = [
      'Estanteria para oficiona',
      'Estanteria para casa',
      'Estanteria para negocio',
    ];

    this.tipoMesas = [
      'Mesa de comedor',
      'Mesa de centro',
      'Mesa de oficina',
      'Mesa auxiliar',
    ];
        
    this.onTipoSeleccionadoChange();
  }     

  onTipoSeleccionadoChange(): void {
    const tipoSeleccionado = this.myForm.get('tipo')?.value;
    if (tipoSeleccionado === 'Silla') {
      this.opcionesTipo = this.tipoSillas;
      this.tipoLabel = 'silla';
    } else if (tipoSeleccionado === 'Escritorio') {
      this.opcionesTipo = this.tipoEscritorios;
      this.tipoLabel = 'escritorio';
    } else if (tipoSeleccionado === 'Estanteria') {
      this.opcionesTipo = this.tipoEstanterias;
      this.tipoLabel = 'estanteria';
    } else if (tipoSeleccionado === 'Mesa') {
      this.opcionesTipo = this.tipoMesas;
      this.tipoLabel = 'mesa';
    } else {
      this.opcionesTipo = [];
    }
    // Reseteamos el valor del tipoHabitacion cuando cambia el tipoSeleccionado
    this.myForm.get('tipoHabitacion')?.setValue('');
  }
  

  addPrompt() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const data = this.myForm.value;
    
    if (this.resultPromptsImages.length >= this.limit) {
      this.alertsService.toast('No puedes agregar más prompts', 'info');
      console.error('ModalPromptComponent::Error limit reached');
      return;
    }

    this.agregarPrompt(data);
    this.generarPromptImage(data);
  
  }

  generarPromptImage(data: any) {
    const { estilo, tipoHabitacion } = data;
    const promptImage = `Genera una imagen de un plano de la elaboracion de un mueble en 3D con vista de frente de un ${tipoHabitacion} con un estilo ${estilo}.`;
    this.resultPromptsImages.push(promptImage);

    console.log('Results Images', this.resultPromptsImages);
  }

  agregarPrompt(data: any) {
    const { tipo, estilo, tipoHabitacion, ancho, largo, alto, material } = data;
  
    if (tipo == 'Silla') {
      const silla = `un ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(silla);
    } else if (tipo == 'Escritorio') {
      const escritorio = `una ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(escritorio);
    } else if (tipo == 'Estanteria') {
      const estanteria = `un ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(estanteria);
    } else if (tipo == 'Mesa') {
      const mesa = `una ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(mesa);
    }
  
    this.generarPromptPresupuesto(data);
  }
  

  generarPromptPresupuesto(data: any) {
    const habitacionesString = this.prompts.join(', ');
    this.resultPromptPresupuesto = `Genera un presupuesto aproximado para la elaboracion de ${habitacionesString}. El estilo que debe tener la elaboracion de de este mueble es ${data.estilo} y el tipo de material es ${data.material}.`;
    console.log('Result Prompt Presupuesto: ', this.resultPromptPresupuesto);
  }

  async onSubmit() {
    // const idChatAi = this.chatService.getCurrentIdChatAi();*******
    let idChatAi = this.chatService.getCurrentIdChatAi();
    if (!idChatAi) {
      // console.error('ModalPromptComponent::Error idChatAi is not defined');********
      idChatAi = 1;
      return;
    }
    this.loading = true;
    this.totalRequests = this.resultPromptsImages.length;

    await this.createImages(this.resultPromptsImages, idChatAi);

    const promptPresupuesto = `${this.resultPromptPresupuesto}`;
      // Por favor, incluye los siguientes detalles en el presupuesto:
      // 1. Materiales de construcción necesarios.
      // 2. Mano de obra requerida.
      // 3. Costos estimados para cada categoría.
      // 4. Un total final del presupuesto.

      // Asegúrate de formatear el presupuesto de manera clara y legible.
      
      // ${FORMAT_JSON}`;

    this.isReady = true;
    await this.createPresupuesto(promptPresupuesto, idChatAi);
    this.chatService.setCurrentIdChatAi(idChatAi);

    this.closeModal();
  }

  async createImages(promptImages: string[], idChatAi: number): Promise<void> {
    for (const image of promptImages) {
      await lastValueFrom(
        this.chatService.createImage(image, idChatAi)
      ).then((resp) => {
        this.pendingRequests++;
        console.log('Images create successfully:', resp);
      }).catch((error) => {
        console.error('ModalPromptComponent::Error Create Image: ', error);
      });
    }
  }

  async createPresupuesto(
    promptPresupuesto: string,
    idChatAi: number
  ): Promise<void> {
    await lastValueFrom(
      this.chatService.createPresupuesto(promptPresupuesto, idChatAi)
    )
      .then((resp) => {
        console.log('Presupuesto create successfully:', resp);
      })
      .catch((error) => {
        console.error(
          'ModalPromptComponent::Error Create Presupuesto: ',
          error
        );
      });
  }

  // checkLoadingState() {
  //   this.pendingRequests--;
  //   if (this.pendingRequests === 0) {
  //     this.loading = false;
  //   }
  // }

  resetAll() {
    this.myForm.reset({
      tipo: 'Silla',
      estilo: '',
      tipoHabitacion: '',
      ancho: '',
      largo: '',
      alto: '',
      material: '',
    });
    this.prompts = [];
    this.resultPromptPresupuesto = '';
    this.resultPromptsImages = [];
    this.onTipoSeleccionadoChange();
    this.loading = false;
    this.isReady = false;
    this.totalRequests = 0;
    this.pendingRequests = 0;
  }

  closeModal() {
    this.onClose.emit();
    this.resetAll();
  }

  isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.myForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.myForm, field);
  }
}
