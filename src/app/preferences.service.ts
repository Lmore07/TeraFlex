// preferences.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  constructor() { }

  setName(key: string, value: string) {
    Preferences.set({
      key: key,
      value: value,
    });
  }

  getName(key: string) {
    return Preferences.get({ key: key });
  }

  removeName(key: string) {
    Preferences.remove({ key: key });
  }

  clearStorage() {
    Preferences.clear();
  }

}