import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-ayudas',
  templateUrl: './ayudas.component.html',
  styleUrls: ['./ayudas.component.scss'],
})
export class AyudasComponent implements OnInit {

  constructor() {
    ScreenOrientation.lock({
      orientation: 'portrait'
    });
  }

  ngOnInit() { }

}
