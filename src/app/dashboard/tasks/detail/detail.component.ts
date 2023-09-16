import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class DetailComponent implements OnInit {


  // Variable para rastrear el video activo actual
  activeVideoElement!: HTMLVideoElement | HTMLIFrameElement;
  @ViewChild('iframeElement') iframeElement!: ElementRef;
  detailTask: TaskDetail | undefined;
  loading!: any;

  videoData: FilesToView[] = [];
  file!: FilesToView;
  index: number = 0;
  idTask!: number;
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
      } else {
        console.log('Handler was called!');
        this.router.navigateByUrl("/dashboard/tasks", { skipLocationChange: true });
      }
    });
  }

  async playSound(event: any) {
    console.log(this.iframeElement.nativeElement);
    console.log(this.iframeElement)
    await this.tts.speak("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s");
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.idTask = params['id'];
      await this.loadDetailTask();
    });
    ScreenOrientation.lock({
      orientation: 'portrait'
    });
    document.addEventListener('fullscreenchange', async () => {
      if (document.fullscreenElement === this.iframeElement.nativeElement) {
        await ScreenOrientation.lock({
          orientation: 'landscape'

        });
      } else {
        await ScreenOrientation.lock({
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
    this.showLoading();
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
              let download: FilesToView = { type: "online", url: "https://www.youtube.com/embed/" + this.getVideoIdFromUrl(element.url) };
              console.log(download)
              this.videoData.push(download);
            } else {
              //await this.downloadFiles(element.id, element.type);
            }
            this.file = this.videoData[0];
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

  probando(event: any) {
    console.log("probando");
    console.log(this.iframeElement);
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
    this.showLoading();
    (await this.taskService.downloadFile(
      id
    )).subscribe(
      (resp: Blob) => {
        const blobUrl = URL.createObjectURL(resp);
        console.log("Video descargado: " + blobUrl)
        let download: FilesToView = { type: type, url: blobUrl };
        this.videoData.push(download);
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
    this.loading.dismiss();
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
}

