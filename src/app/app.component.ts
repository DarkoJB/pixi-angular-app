import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PixiCanvasComponent } from './components/pixi-canvas/pixi-canvas.component';
import { CustomSlotsComponent } from './components/custom-slots/custom-slots.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PixiCanvasComponent, CustomSlotsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pixi-angular-app';
}
