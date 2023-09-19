import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskServiceService } from 'src/app/servicios/task-service.service';
import { PreferencesService } from '../../preferences.service';
import { ApiResponseListTasksAssignsToPatientI, TaskDetailAssignToPatientI } from 'src/app/interfaces/Task.interface';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {


  tasksData!: TaskDetailAssignToPatientI[];
  loading!: any;
  estadoActivity: boolean = false;

  constructor(
    public taskService: TaskServiceService,
    public preferencesService: PreferencesService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {
    ScreenOrientation.lock({
      orientation: 'portrait'
    });
    this.platform.backButton.subscribeWithPriority(10, async () => {
      if (this.loading) {
        this.esconderLoading();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.loading) {
      this.esconderLoading();
    }
  }

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.showLoading();
    (await this.taskService.getTasks(
      Number.parseInt(localStorage.getItem("userId") ?? '0'), this.estadoActivity
    )).subscribe(
      (resp) => {
        if (resp.data.length == 0) {
          this.presentAlert("Lo sentimos", "No tiene tareas asignadas por ahora.");
        } else {
          console.log(resp);
          this.tasksData = resp.data;
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
    this.tasksData = [];
    await this.loadTasks();
    event.target.complete();
  }

  async handleChange(e: any) {
    this.estadoActivity = e.detail.value;
    this.tasksData = [];
    await this.loadTasks();
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando',
      animated: true,
      mode: 'ios'
    });
    this.loading.present();
  }

  async esconderLoading() {
    await this.loading.dismiss();
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      mode: 'ios'
    });
    await alert.present();
  }

}
