// preferences.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  constructor() {}

  async setName(key: string, value: string) {
    await Preferences.set({
      key: key,
      value: value,
    });
  }

  async getName(key: string) {
    const { value } = await Preferences.get({ key: key });
    return value;
  }

  async removeName(key: string) {
    await Preferences.remove({ key: key });
  }
}