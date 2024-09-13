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
  public tipoHabitaciones!: string[];
  public tipoCocinas!: string[];
  public tipoBaños!: string[];
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
      tipo: ['Habitación', Validators.required],
      estilo: ['', Validators.required],
      tipoHabitacion: ['', Validators.required],
      ancho: ['', Validators.required],
      largo: ['', Validators.required],
      alto: ['', Validators.required],
      tipoObra: ['', Validators.required],
    });

    this.tipoHabitaciones = [
      'Dormitorio matrimonial',
      'Dormitorio infantil',
      'Dormitorio para huéspedes',
      'Dormitorio individual',
    ];

    this.tipoCocinas = [
      'Cocina en línea',
      'Cocina en isla',
      'Cocina en paralelo o dos frentes',
      'Cocina en forma de L',
      'Cocina en forma de U',
    ];
    
    this.tipoBaños = [
      'Baño completo',
      'Baño de cortesía',
      'Baño de servicio',
      'Baño en suite',
    ]

    this.onTipoSeleccionadoChange();
  }

  onTipoSeleccionadoChange(): void {
    const tipoSeleccionado = this.myForm.get('tipo')?.value;
    if (tipoSeleccionado === 'Habitación') {
      this.opcionesTipo = this.tipoHabitaciones;
      this.tipoLabel = 'habitación';
    } else if (tipoSeleccionado === 'Cocina') {
      this.opcionesTipo = this.tipoCocinas;
      this.tipoLabel = 'cocina';
    } else if (tipoSeleccionado === 'Baño') {
      this.opcionesTipo = this.tipoBaños;
      this.tipoLabel = 'baño';
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
    const promptImage = `Genera una imagen de un plano de una sola planta en 3D con vista de frente de un ${tipoHabitacion} con un estilo ${estilo}.`;
    this.resultPromptsImages.push(promptImage);

    console.log('Results Images', this.resultPromptsImages);
  }

  agregarPrompt(data: any) {
    const { tipo, estilo, tipoHabitacion, ancho, largo, alto, tipoObra } = data;

    if (tipo == 'Habitación') {
      const habitacion = `un ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(habitacion);
    } else if (tipo == 'Cocina') {
      const cocina = `una ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(cocina);
    } else if (tipo == 'Baño') {
      const baño = `un ${tipoHabitacion} con un ancho de ${ancho} metros, un largo de ${largo} metros y un alto de ${alto} metros`;
      this.prompts.push(baño);
    }

    this.generarPromptPresupuesto(data);
  }

  generarPromptPresupuesto(data: any) {
    const habitacionesString = this.prompts.join(', ');
    this.resultPromptPresupuesto = `Genera un presupuesto aproximado para la construcción de ${habitacionesString} en Bolivia. El estilo que debe tener esta construcción es ${data.estilo} y el tipo de obra es ${data.tipoObra}.`;
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
      tipo: 'Habitación',
      estilo: '',
      tipoHabitacion: '',
      ancho: '',
      largo: '',
      alto: '',
      tipoObra: '',
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
