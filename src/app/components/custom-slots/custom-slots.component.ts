import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Application, Texture } from 'pixi.js';
@Component({
  selector: 'app-custom-slots',
  templateUrl: './custom-slots.component.html',
  styleUrls: ['./custom-slots.component.scss'],
  standalone: true,
})
export class CustomSlotsComponent implements OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  private pixiApp!: Application;
  private slotTextures: Texture[] = [];
  constructor() {}

  ngOnInit() {
    this.pixiApp = new Application();
    this.pixiApp
      .init({
        width: 800,
        height: 600,
        hello: true,
      })
      .then(() => {
        //DON'T USE VIEW from pixiApp
        this.gameContainer.nativeElement.appendChild(this.pixiApp.canvas);
      });
  }

  loadAssets() {
    this.slotTextures.push(
      Texture.from('assets/images/flowerTop.png'),
      Texture.from('assets/images/helmlok.png'),
      Texture.from('assets/images/skully.png'),
      Texture.from('assets/images/eggHead.png')
    );
    //this.createSlots();
  }
}
