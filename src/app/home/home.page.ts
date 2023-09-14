import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PreferencesService } from './../preferences.service';
import * as jose from 'jose'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  // Declarar un FormGroup para el formulario reactivo
  formulario!: FormGroup;
  loading!: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    public router: Router,
    private preferencesService: PreferencesService,
    public userService: UsuarioService) {
    this.formulario = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      contraseña: ['', [Validators.required]],
    });
  }


  ngOnDestroy(): void {

  }

  ngOnInit(): void {

  }

  // Agregar una función para manejar la presentación de errores
  mostrarError(campo: any) {
    return this.formulario.get(campo)?.hasError('required') ? 'Este campo es requerido' : '';
  }

  // Agregar una función para manejar el envío del formulario
  onSubmit() {
    if (this.formulario.valid) {
      this.showLoading();
      console.log('Formulario válido:', this.formulario.value);
      this.userService.login(this.formulario.get("usuario")?.value, this.formulario.get("contraseña")?.value).subscribe(
        async (resp) => {
          const tokenDecode:any = jose.decodeJwt(resp.data.token);
          if (tokenDecode.role=='PATIENT') {
            await this.preferencesService.setName('token', resp.data.token);
            await this.preferencesService.setName('userId', tokenDecode.id);
            this.esconderLoading();
            this.router.navigateByUrl("/dashboard");
          }else{
            this.presentAlert("No autorizado","La aplicación es unicamente para pacientes");
          }
        },
        (error) => {
          this.esconderLoading();
        }
      );
    } else {
      this.presentAlert("Formulario incorrecto", "Por favor, complete todos los campos");
      console.log('Formulario no válido. Por favor, complete los campos requeridos.');
    }
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando',
      animated: true
    });

    this.loading.present();
  }

  esconderLoading() {
    this.loading.dismiss();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}