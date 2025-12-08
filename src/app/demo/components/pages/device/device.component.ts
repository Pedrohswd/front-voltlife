import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CrudRoutingModule } from '../crud/crud-routing.module';
import { CommonModule } from '@angular/common';
import { DeviceService } from 'src/app/services/device.service';
import { Device } from 'src/app/model/device';


@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule,
    CrudRoutingModule,
    TableModule,
    FileUploadModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss'
})
export class DeviceComponent implements OnInit {

  deviceDialog: boolean = false;
  deleteDeviceDialog: boolean = false;
  deleteDevicesDialog: boolean = false;

  devices: Device[] = [];
  device: Device = {};
  devicesSelecionados: Device[] = [];
  submitted: boolean = false;
  houseId!: number;

  deviceForm!: FormGroup;

  categorias = [
    { label: 'Eletrodoméstico', value: 'ELETRODOMESTICO' },
    { label: 'Entretenimento e lazer', value: 'ENTRETENIMENTO_LAZER' },
    { label: 'Informática e escritório', value: 'INFORMATICA_ESCRITORIO' },
    { label: 'Comunicação', value: 'COMUNICACAO' },
    { label: 'Climatização e conforto', value: 'CLIMATIZACAO_CONFORTO' },
    { label: 'Iluminação ou automação', value: 'ILUMINACAO_AUTOMACAO' }
  ];

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.houseId = +this.route.snapshot.paramMap.get('id')!;
    this.carregarDevices();
    this.initForm();
  }

  initForm() {
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      mark: ['', Validators.required],
      model: ['', Validators.required],
      voltage: [null, Validators.required],
      monthlyConsumption: [null, Validators.required],
      annualConsumption: [null, Validators.required],
      category: ['', Validators.required]
    });
  }

  carregarDevices() {
    this.deviceService.getByHouse(this.houseId).subscribe(data => this.devices = data);
  }

  abrirNovoDevice() {
    this.device = {};
    this.submitted = false;
    this.deviceForm.reset();
    this.deviceDialog = true;
  }

  excluirSelecionados() {
    this.deleteDevicesDialog = true;
  }

  editarDevice(device: Device) {
    this.device = { ...device };
    this.deviceForm.patchValue(device);
    this.deviceDialog = true;
  }

  confirmarExclusao(device: Device) {
    this.deleteDeviceDialog = true;
    this.device = { ...device };
  }

  confirmarDeleteSelecionados() {
    const deleteRequests = this.devicesSelecionados.map(device =>
      this.deviceService.delete(device.id!)
    );

    Promise.all(deleteRequests.map(req => req.toPromise())).then(() => {
      this.carregarDevices();
      this.devicesSelecionados = [];
      this.deleteDevicesDialog = false;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dispositivos excluídos', life: 3000 });
    });
  }

  confirmarDeleteDevice() {
    this.deviceService.delete(this.device.id!).subscribe(() => {
      this.carregarDevices();
      this.deleteDeviceDialog = false;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dispositivo excluído', life: 3000 });
    });
  }

  fecharDialog() {
    this.deviceDialog = false;
    this.submitted = false;
  }

  salvarDevice() {
    this.submitted = true;
    if (this.deviceForm.invalid) return;

    const formValues = this.deviceForm.value;

    if (this.device.id) {
      const deviceToUpdate: Device = { ...formValues, id: this.device.id };
      this.deviceService.update(this.device.id, deviceToUpdate).subscribe(() => {
        this.carregarDevices();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dispositivo atualizado', life: 3000 });
        this.deviceDialog = false;
      });
    } else {
      this.deviceService.create(formValues, this.houseId).subscribe(() => {
        this.carregarDevices();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dispositivo criado', life: 3000 });
        this.deviceDialog = false;
      });
    }
    this.device = {};
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
