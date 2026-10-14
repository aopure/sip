import { State } from "./types";

const canvas = <HTMLCanvasElement>document.getElementById('sip-canvas');

export function setMode(state: State, mode: string) {
  switch (mode) {
    case 'move': {
      state.mode = 'move';
      canvas.style.cursor = 'move';
    }
  }
}