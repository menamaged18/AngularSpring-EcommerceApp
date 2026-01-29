import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { EffectsModule } from '@ngrx/effects';
// import { UserEffects } from './effects/user.effects';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce');
}
