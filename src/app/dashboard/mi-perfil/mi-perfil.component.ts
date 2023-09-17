import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { PreferencesService } from 'src/app/preferences.service';
import { ApiNotificationService } from 'src/app/servicios/notificactions/api-notification.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { TextToSpeechService } from 'src/app/servicios/text-to-speech.service';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
})
export class MiPerfilComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  loading!: any;
  dashboard="/dashboard";

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private userService: UsuarioService,
    private router:Router,
    private tts:TextToSpeechService,
    private notificationService: ApiNotificationService,
    private preferencesService: PreferencesService,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {
    ScreenOrientation.lock({
      orientation: 'portrait'
    });
    this.platform.backButton.subscribeWithPriority(10, async () => {
      this.esconderLoading();
    });
    this.form = this.formBuilder.group({
      nombres: [''],
      cedula: [''],
      telefono: [''],
      descripcion: ['']
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy')
    this.tts.stop()
  }

  async ngOnInit() {
    this.showLoading();
    (await this.userService.getDataUser()).subscribe(
      async (resp) => {
        if (resp.data.id == undefined) {
          this.presentAlert("Lo sentimos", "Ha ocurrido un error");
        } else {
          console.log(resp)
          this.form.controls['nombres'].setValue(resp.data.firstName+" "+resp.data.lastName);
          this.form.controls['cedula'].setValue(resp.data.docNumber);
          this.form.controls['telefono'].setValue(resp.data.phone);
          this.form.controls['descripcion'].setValue(resp.data.description);  
        }
        this.esconderLoading();
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
      }
    );
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      mode:'ios'
    });
    await alert.present();
  }

  returnToDashboard():string{
    this.tts.stop();
    return '/dashboard';
  }


  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando',
      animated: true,
      mode: 'ios'
    });

    this.loading.present();
  }

  async logOut(){
    this.showLoading();
    (await this.notificationService.updateDevice()).subscribe(
      (resp) => {
        this.esconderLoading();
        this.alertWithActions("Cierre exitoso","Se ha cerrado la sesión con éxito");
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
        this.presentAlert("Lo sentimos","Ocurrió un error al cerrar la sesión");
      }
    );
  }

  async alertWithActions(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'OK',
        role: 'confirm',
        handler: async () => {
          this.preferencesService.clearStorage();
          this.router.navigateByUrl("/login");
        }
      }],
      mode:'ios'
    });
    await alert.present();
  }

  esconderLoading() {
    this.loading.dismiss();
  }

  public async speak(): Promise<void> {
    this.tts.speak(this.retornaTextToSpeech());
  }


  retornaTextToSpeech():string {
    const mensaje =
      'Hola, tu nombre es '+
      this.form.controls['nombres'].value +
      ' , tu número de cédula es ' +
      this.form.controls['cedula'].value +
      ' , el teléfono es ' +
      this.form.controls['telefono'].value +
      'y la descripción dada por tu terapeuta es ' +
      this.form.controls['descripcion'].value;
      return mensaje;
  }
}
