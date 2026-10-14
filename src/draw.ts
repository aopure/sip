export function draw(ctx: CanvasRenderingContext2D, color: string) {
  let rectColor = color;
  ctx.fillStyle = rectColor;
  ctx.fillRect(50, 50, 300, 100);
}