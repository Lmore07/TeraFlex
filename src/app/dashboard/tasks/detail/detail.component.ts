import { AfterContentChecked, AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { TaskServiceService } from 'src/app/servicios/task-service.service';
import { FilesToView, TaskDetail } from 'src/app/interfaces/Task.interface';
import { register } from 'swiper/element/bundle';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { TextToSpeechService } from 'src/app/servicios/text-to-speech.service';

register();
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {

  detailTask: TaskDetail | undefined;
  loading!: HTMLIonLoadingElement;

  videoData: FilesToView[] = [];
  file!: FilesToView;
  index: number = 0;
  idTask!: number;
  apiLoaded = false;
  target!: any;
  repoduciendoSonido = false;

  constructor(
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private taskService: TaskServiceService,
    private platform: Platform,
    private tts: TextToSpeechService,
    private sanitizer: DomSanitizer
  ) {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      if ((await ScreenOrientation.orientation()).type.includes('landscape')) {
        await ScreenOrientation.lock({
          orientation: 'portrait'
        });
        document.exitFullscreen();
      } else {
        this.router.navigateByUrl("/dashboard/tasks", { skipLocationChange: true });
      }
      if (this.loading) {
        this.esconderLoading();
      }
    });
  }

  ngOnDestroy(): void {
    this.tts.stop();
    if (this.loading) {
      this.esconderLoading();
    }
  }

  async playSound(event: any) {
    if (!this.repoduciendoSonido) {
      this.repoduciendoSonido = true;
      const messageVoice = this.getMessageVoice(this.detailTask?.title!, this.detailTask?.description!, this.detailTask?.estimatedTime!);
      await this.tts.speak(messageVoice);
      this.repoduciendoSonido = false;
    } else {
      this.repoduciendoSonido = false;
      await this.tts.stop();
    }

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.idTask = params['id'];
      this.loadDetailTask();
    });
    ScreenOrientation.lock({
      orientation: 'portrait'
    });
    document.addEventListener('fullscreenchange', async () => {
      if (document.fullscreenElement) {
        ScreenOrientation.lock({
          orientation: 'landscape'
        });
      } else {
        ScreenOrientation.lock({
          orientation: 'portrait'
        });
      }
    });
    document.addEventListener('webkitfullscreenchange', () => {
      ScreenOrientation.unlock();
      if (document.fullscreenElement) {
        ScreenOrientation.lock({
          orientation: 'landscape'
        });
      } else {
        ScreenOrientation.lock({
          orientation: 'portrait'
        });
      }
    });

  }

  siguienteVideo() {
    this.index += 1;
    this.file = this.videoData[this.index];
  }

  anteriorVideo() {
    this.index -= 1;
    this.file = this.videoData[this.index];
  }

  async loadDetailTask() {
    await this.showLoading();
    (await this.taskService.getDetailTask(
      this.idTask
    )).subscribe(
      (resp) => {
        if (resp.data == null) {
          this.presentAlert("Lo sentimos", "Ha ocurrido un error");
        } else {
          console.log(resp);
          this.detailTask = resp.data;
          this.detailTask.files.forEach(async element => {
            if (element.type == "online") {
              let download: FilesToView = { type: "online", url: this.showVideo("https://www.youtube.com/embed/" + this.getVideoIdFromUrl(element.url)) };
              this.videoData.push(download);
              this.file = this.videoData[0];
            } else {
              await this.downloadFiles(element.id, element.type);
            }
          });
        }
        this.esconderLoading();
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
      }
    );
  }

  async handleRefresh(event: any) {
    this.detailTask = undefined;
    this.videoData = [];
    await this.loadDetailTask();
    event.target.complete();
  }

  showVideo(video: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  async finalizaTarea() {
    this.showLoading();
    (await this.taskService.completeTask(
      this.idTask
    )).subscribe(
      (resp) => {
        this.esconderLoading();
        this.presentAlert("Excelente", "La tarea se completó con éxito");
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
      }
    );
  }

  async downloadFiles(id: number, type: string) {
    await this.showLoading();
    (await this.taskService.downloadFile(
      id
    )).subscribe(
      (resp: Blob) => {
        const blobUrl = URL.createObjectURL(resp);
        let download: FilesToView = { type: type, url: blobUrl };
        this.videoData.push(download);
        this.file = this.videoData[0];
        this.esconderLoading();
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
      }
    );
  }

  getVideoIdFromUrl(url: string): string {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]*)/);
    if (videoIdMatch && videoIdMatch.length >= 2) {
      return videoIdMatch[1];
    }
    return "";
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando',
      animated: true,
      mode: 'ios'
    });
    this.loading.present();
  }

  esconderLoading() {
    console.log(this.loading)
    if(this.loading){
      this.loading.dismiss();
    }
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      mode: 'ios',
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigateByUrl("/dashboard/tasks", { skipLocationChange: true });
          }
        }
      ],
    });
    await alert.present();
  }

  getMessageVoice(
    title: string, description: string, timeExpected: number) {
    const messages = [
      `Hola, tu tarea ${title} consiste en ${description}. Te recomiendo dedicar al menos ${timeExpected} minutos para completarla.`,
      `¡Hola! No olvides realizar la tarea "${title}". Es importante ${description}. Asigna al menos ${timeExpected} minutos para ello.`,
      `Hola, recuerda que tienes la tarea "${title}". Asegúrate de ${description} y toma al menos ${timeExpected} minutos para completarla.`,
      `¡Hola ! Quiero recordarte sobre la tarea "${title}". Asegúrate de ${description} y reserva ${timeExpected} minutos para completarla.`,
      `Hola, no olvides la tarea "${title}". Debes ${description} y tomar al menos ${timeExpected} minutos para finalizarla.`,
      `¡Hola! Te recuerdo que debes realizar la tarea "${title}". Asegúrate de ${description} y asigna ${timeExpected} minutos para ello.`,
      `Hola, no descuides la tarea "${title}". Es importante ${description} y requiere al menos ${timeExpected} minutos de tu tiempo.`,
      `¡Hola! No olvides dedicar tiempo a la tarea "${title}". Recuerda ${description} y toma ${timeExpected} minutos para realizarla correctamente.`,
      `Hola, ten en cuenta la tarea "${title}". Es necesario ${description} y debes invertir al menos ${timeExpected} minutos en ello.`,
      `¡Hola! No pierdas de vista la tarea "${title}". Recuerda ${description} y reserva ${timeExpected} minutos para completarla exitosamente.`,
    ];
    const randomMessage = messages[this.getRandomInt(0, 10)];
    return randomMessage;
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

