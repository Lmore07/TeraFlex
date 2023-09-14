import { Component, OnInit } from '@angular/core';
import { TaskServiceService } from 'src/app/servicios/task-service.service';
import { PreferencesService } from '../../preferences.service';
import { ApiResponseListTasksAssignsToPatientI, TaskDetailAssignToPatientI } from 'src/app/interfaces/Task.interface';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {


  tasksData!: TaskDetailAssignToPatientI[];
  loading!: any;
  estadoActivity:boolean=false;

  constructor(
    public taskService: TaskServiceService,
    public preferencesService: PreferencesService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.showLoading();
    (await this.taskService.getTasks(
      Number.parseInt(await this.preferencesService.getName("userId") ?? '0'), this.estadoActivity
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

  async handleChange(e:any) {
    this.estadoActivity=e.detail.value;
    this.tasksData=[];
    await this.loadTasks();
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
