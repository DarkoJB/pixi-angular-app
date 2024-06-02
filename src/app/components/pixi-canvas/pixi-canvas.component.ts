import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-pixi-canvas',
  templateUrl: './pixi-canvas.component.html',
  styleUrls: ['./pixi-canvas.component.scss'],
  standalone: true,
})
export class PixiCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;
  pixiApp!: PIXI.Application;

  slotTexturesArr: PIXI.Texture[] = [];

  REEL_WIDTH = 160;
  SYMBOL_SIZE = 150;
  reels = [] as any[]; //TODO: Fix this any[]
  reelContainer = new PIXI.Container();
  slotsRunning = false;

  tweeningArr = [] as any[];

  //Header and footer
  // top = new PIXI.Graphics();
  // bottom = new PIXI.Graphics();
  constructor() {}

  ngOnInit() {
    this.pixiApp = new PIXI.Application();
    //Initialize PixiApp with configs
    this.pixiApp
      .init({
        // resizeTo: window,
        // hello: true, //Basic test if Pixi works
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
      })
      //for some reason appending the child needs to be followed throught with 'then' after init
      .then(() => {
        //Adds Pixi's canvas element to ViewChild
        this.pixiContainer.nativeElement.appendChild(this.pixiApp.canvas);
      })
      .catch((error) => console.error(error));

    //Load assets
    this.loadSlotAssets()
      .then(() => {
        this.buildReels();
      })
      .catch((error) => {
        console.error('Error loading assets:', error);
      });
  }

  async loadSlotAssets() {
    // Load images for slots from Pixi
    await PIXI.Assets.load([
      'assets/images/flowerTop.png',
      'assets/images/helmlok.png',
      'assets/images/skully.png',
      'assets/images/eggHead.png',
    ]);

    // Initialize slot textures
    this.slotTexturesArr = [
      PIXI.Texture.from('assets/images/flowerTop.png'),
      PIXI.Texture.from('assets/images/helmlok.png'),
      PIXI.Texture.from('assets/images/skully.png'),
      PIXI.Texture.from('assets/images/eggHead.png'),
    ];
  }

  buildReels() {
    for (let i = 0; i < 5; i++) {
      const rc = new PIXI.Container();

      rc.x = i * this.REEL_WIDTH;
      this.reelContainer.addChild(rc);

      const reel = {
        container: rc,
        symbols: [] as any[], //TODO: Fix this any[]
        position: 0,
        previousPosition: 0,
        blur: new PIXI.BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Build the symbols
      for (let j = 0; j < 4; j++) {
        const symbol = new PIXI.Sprite(
          this.slotTexturesArr[
            Math.floor(Math.random() * this.slotTexturesArr.length)
          ]
        );
        // Scale the symbol to fit symbol area.
        symbol.y = j * this.SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(
          this.SYMBOL_SIZE / symbol.width,
          this.SYMBOL_SIZE / symbol.height
        );
        symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);

        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      this.reels.push(reel);
    }
    this.pixiApp.stage.addChild(this.reelContainer);
  }

  reelsComplete() {
    this.slotsRunning = false;
  }

  startPlay() {
    if (this.slotsRunning) return;
    this.slotsRunning = true;

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;

      this.tweenTo(
        r,
        'position',
        target,
        time,
        this.backout(0.5),
        null,
        i === this.reels.length - 1 ? this.reelsComplete() : null
      );
    }

    this.playAnimation();
  }

  //TWEENING DEFINITION
  // Tweening is the process of creating the in-betweens,
  // which are the images that go between keyframes.
  // Also known as 'inbetweeing,'
  // the result in a smooth transition between two keyframes that depict different points in an action
  tweenTo(
    object: { [x: string]: any },
    property: any,
    target: any,
    time: any,
    easing: any,
    onchange: any,
    oncomplete: any
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    this.tweeningArr.push(tween);
    return tween;
  }

  // buildHeaderAndFooter() {
  //   // Build top & bottom covers and position reelContainer
  //   const margin = (this.pixiApp.screen.height - this.SYMBOL_SIZE * 3) / 2;

  //   this.reelContainer.y = margin;
  //   this.reelContainer.x = Math.round(
  //     this.pixiApp.screen.width - this.REEL_WIDTH * 5
  //   );
  //   const top = new PIXI.Graphics()
  //     .rect(0, 0, this.pixiApp.screen.width, margin)
  //     .fill({ color: 0x0 });
  //   const bottom = new PIXI.Graphics()
  //     .rect(0, this.SYMBOL_SIZE * 3 + margin, this.pixiApp.screen.width, margin)
  //     .fill({ color: 0x0 });

  //   // Create gradient fill
  //   const fill = new PIXI.FillGradient(0, 0, 0, 36 * 1.7);

  //   const colors = [0xffffff, 0x00ff99].map((color) =>
  //     PIXI.Color.shared.setValue(color).toNumber()
  //   );

  //   colors.forEach((number, index) => {
  //     const ratio = index / colors.length;

  //     fill.addColorStop(ratio, number);
  //   });

  //   // Add play text
  //   const style = new PIXI.TextStyle({
  //     fontFamily: 'Arial',
  //     fontSize: 36,
  //     fontStyle: 'italic',
  //     fontWeight: 'bold',
  //     fill: { fill },
  //     stroke: { color: 0x4a1850, width: 5 },
  //     dropShadow: {
  //       color: 0x000000,
  //       angle: Math.PI / 6,
  //       blur: 4,
  //       distance: 6,
  //     },
  //     wordWrap: true,
  //     wordWrapWidth: 440,
  //   });

  //   const playText = new Text('Spin the wheels!');
  //   playText.x = Math.round((bottom.width - playText.width) / 2);
  //   playText.y =
  //     app.screen.height - margin + Math.round((margin - playText.height) / 2);
  //   bottom.addChild(playText);

  //   // Add header text
  //   const headerText = new Text('PIXI MONSTER SLOTS!');

  //   headerText.x = Math.round((top.width - headerText.width) / 2);
  //   headerText.y = Math.round((margin - headerText.height) / 2);
  //   top.addChild(headerText);

  //   app.stage.addChild(top);
  //   app.stage.addChild(bottom);

  //   // Set the interactivity.
  //   bottom.eventMode = 'static';
  //   bottom.cursor = 'pointer';
  //   bottom.addListener('pointerdown', () => {
  //     startPlay();
  //   });
  // }

  playAnimation() {
    this.pixiApp.ticker.add(() => {
      //Basic matrix setup with i and j
      for (let i = 0; i < this.reels.length; i++) {
        const r = this.reels[i];
        // Update blur filter y amount based on speed.
        // This would be better if calculated with time in mind also. Now blur depends on frame rate.
        //Make the Y axis of columns blurry when the slots are spinning
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;
        // Update symbol positions on reel.
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          const prevy = s.y;

          s.y =
            ((r.position + j) % r.symbols.length) * this.SYMBOL_SIZE -
            this.SYMBOL_SIZE;
          if (s.y < 0 && prevy > this.SYMBOL_SIZE) {
            // Detect going over and swap a texture.
            // This should in proper product be determined from some logical reel.
            s.texture =
              this.slotTexturesArr[
                Math.floor(Math.random() * this.slotTexturesArr.length)
              ];
            s.scale.x = s.scale.y = Math.min(
              this.SYMBOL_SIZE / s.texture.width,
              this.SYMBOL_SIZE / s.texture.height
            );

            s.x = Math.round((this.SYMBOL_SIZE - s.width) / 2);
          }
        }
      }
    });
    this.pixiApp.ticker.add(() => {
      const now = Date.now();
      const remove = [];

      for (let i = 0; i < this.tweeningArr.length; i++) {
        const t = this.tweeningArr[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = this.lerp(
          t.propertyBeginValue,
          t.target,
          t.easing(phase)
        );
        if (t.change) t.change(t);
        if (phase === 1) {
          t.object[t.property] = t.target;
          if (t.complete) t.complete(t);
          remove.push(t);
        }
      }
      for (let i = 0; i < remove.length; i++) {
        this.tweeningArr.splice(this.tweeningArr.indexOf(remove[i]), 1);
      }
    });
  }

  lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  ngOnDestroy() {
    this.pixiApp.destroy(true, { children: true });
  }
}
