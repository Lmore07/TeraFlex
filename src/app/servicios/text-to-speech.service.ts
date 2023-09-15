import { TextToSpeech, TTSOptions } from '@capacitor-community/text-to-speech';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor() { }

  public async speak(message: string): Promise<void> {
    console.log("await speak")
    const options: TTSOptions = {
      text: message,
      lang: 'es',
      rate: 0.7
    };
    await TextToSpeech.speak(options);
  }

  public async stop(): Promise<void> {
    await TextToSpeech.stop();
  }

  public async openInstall(): Promise<void> {
    await TextToSpeech.openInstall();
  }
}
