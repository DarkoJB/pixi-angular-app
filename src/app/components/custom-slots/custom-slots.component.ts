import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from 'pixi.js';
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
  assetIds!: { [key: string]: number };
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
        //DON'T USE VIEW FROM pixiApp
        this.gameContainer.nativeElement.appendChild(this.pixiApp.canvas);
      })
      .catch((error) => {
        console.error(error);
      });
    this.loadAssets()
      .then(() => {
        this.createSlots();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async loadAssets() {
    // await Assets.load([
    //   'assets/images/flowerTop.png',
    //   'assets/images/helmlok.png',
    //   'assets/images/skully.png',
    //   'assets/images/eggHead.png',
    // ]);

    // this.slotTextures.push(
    //   Texture.from('assets/images/flowerTop.png'),
    //   Texture.from('assets/images/helmlok.png'),
    //   Texture.from('assets/images/skully.png'),
    //   Texture.from('assets/images/eggHead.png')
    // );

    const assetPaths = [
      'assets/images/flowerTop.png',
      'assets/images/helmlok.png',
      'assets/images/skully.png',
      'assets/images/eggHead.png',
    ];

    const assetIds: { [key: string]: number } = {};

    for (let i = 0; i < assetPaths.length; i++) {
      const path = assetPaths[i];
      await Assets.load([path]);
      Texture.from(path);
      assetIds[path] = i;
    }

    this.slotTextures = assetPaths.map((path) => Texture.from(path));
    this.assetIds = assetIds;

    return assetIds;
    // return assetIds;
  }

  createSlots() {
    const reels: any[] = [];
    const reelWidth = 160;
    const reelHeight = 160;
    //TODO: Check if we can do anything else other than 3, and what it does
    //i => x-axis, j => y-axis
    for (let i = 0; i < 3; i++) {
      const reelContainer = new Container();
      reelContainer.x = i * reelWidth;
      this.pixiApp.stage.addChild(reelContainer);
      console.log(reelContainer);

      const symbols: any[] = [];
      for (let j = 0; j < 3; j++) {
        const symbol = new Sprite(
          this.slotTextures[
            Math.floor(Math.random() * this.slotTextures.length)
          ]
        );
        symbol.y = j * reelHeight;
        symbols.push(symbol);
        reelContainer.addChild(symbol);
      }
      reels.push({ container: reelContainer, symbols });
    }
    //Generate and add spin button to template

    const spinButton = new Graphics({
      interactive: true,
      x: this.pixiApp.screen.width / 2 - 50,
      y: this.pixiApp.screen.height - 70,
      cursor: 'pointer',
      onclick: () => {
        this.spinReels(reels, this.assetIds, reelWidth);
      },
    });
    spinButton.fill({ color: 0x0ff000 });
    spinButton.rect(0, 0, 100, 50);
    this.pixiApp.stage.addChild(spinButton);

    const spinText = new Text('SPIN', { fontSize: 24, fill: '#ffffff' });

    spinText.x = this.pixiApp.screen.width / 20;
    spinText.y = 10;
    spinButton.addChild(spinText);
  }

  spinReels(
    reels: any[],
    assetIds: { [key: string]: number },
    reelWidth: number
  ) {
    const winningReelIndexes = this.checkWinningCombination(reels);
    // if (winningReelIndexes.length > 0) {
    //   this.showWinningText(winningReelIndexes, reelWidth);
    // }
    for (const reel of reels) {
      for (const symbol of reel.symbols) {
        symbol.texture =
          this.slotTextures[
            Math.floor(Math.random() * this.slotTextures.length)
          ];
      }
    }
  }
  checkWinningCombination(reels: any[]): number[] {
    const winningRows: number[] = [];
    const numRows = reels[0].symbols.length;

    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      const firstSymbolId = reels[0].symbols[rowIndex].texture.baseTexture._id;
      let isWinningRow = true;

      for (let reelIndex = 1; reelIndex < reels.length; reelIndex++) {
        const symbolId =
          reels[reelIndex].symbols[rowIndex].texture.baseTexture._id;
        if (symbolId !== firstSymbolId) {
          isWinningRow = false;
          break;
        }
      }

      if (isWinningRow) {
        winningRows.push(rowIndex);
      }
    }

    return winningRows;
  }

  showWinningText(winngReelIndexes: number[], reelWidth: number) {
    const winningText = new Text('JACKPOT', { fontSize: 36, fill: '#ff0000' });
    for (const index of winngReelIndexes) {
      winningText.x = index * reelWidth; // Adjust X pos. based on win. reel index
      winningText.y = 200; // Adjust Y pos. based on layout
      this.pixiApp.stage.addChild(winningText);
    }
  }

  ngOnDestroy(): void {
    this.pixiApp.destroy(true, { children: true });
  }
}
