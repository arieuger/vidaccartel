const PIXEL_SIZE = 7;

const WIDTH = 600;
const HEIGHT = WIDTH * 1.414;

const X_OFFSET = -65;
const Y_OFFSET = 120;

const VID_RATIO = 1;

const ACCENT_FIRST_COLOR = "#59ffc5";
const ACCENT_SECOND_COLOR = "#ff5959";
const BACKGROUND_COLOR = "#212121";
let accentColor1;
let accentColor2;

// Ctrl + Shift + A -> Use JavaScript Library
function setup() {
    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.id("p5jsCanvas");
    vid = createVideo("media/si2-c-sm-t.mp4");    
    vid.size(720 * VID_RATIO, 766 * VID_RATIO);

    vid.volume(0);
    vid.loop();
    vid.hide();

    accentColor1 = color(ACCENT_FIRST_COLOR);
    accentColor2 = color(ACCENT_SECOND_COLOR);
}

function draw() {
    background(BACKGROUND_COLOR);
    
    vid.loadPixels();
    
    noStroke();

    for (let y = 0; y < canvas.height + Math.abs(Y_OFFSET); y += PIXEL_SIZE) {
        for (let x = 0; x < canvas.width + Math.abs(X_OFFSET); x += PIXEL_SIZE) {
            const i = y * vid.width + x;
            
            // El valor en la posición i * 4     corresponde al componente rojo (R) del píxel.
            // El valor en la posición i * 4 + 1 corresponde al componente verde (G) del píxel.
            // El valor en la posición i * 4 + 2 corresponde al componente azul (B) del píxel.
            // El valor en la posición i * 4 + 3 corresponde al componente alfa (A) del píxel.

            const rIntensity = (255 - vid.pixels[i * 4]) / 255;
            const gIntensity = (255 - vid.pixels[i * 4] + 1) / 255;
            const bIntensity = (255 - vid.pixels[i * 4] + 2) / 255;
            const mIntensity = (rIntensity + gIntensity + bIntensity) / 3;
            
            // if (mIntensity > 0.01) {
            // if (rIntensity < 0.95 && gIntensity < 0.95 && bIntensity < 0.95) {
            if (mIntensity < 0.95) {
                // Para usar a cor orixinal:
                // fill(vid.pixels[i * 4], vid.pixels[i * 4 + 1] - 40, vid.pixels[i * 4 + 2]);
                
                // Usar degradado
                // Obter ubicación en Y do canvas como porcentaxe
                let normalizedY = (y + Y_OFFSET) / (HEIGHT - 90);
                let colorToFill = lerpColor(accentColor1, accentColor2, normalizedY)
                fill(colorToFill);

                // Para usar unha sola cor
                // fill(accentColor1);
                
                
                
                // Para usar unha cor gradiente en intensidade:
                // fill(red(accentColor1) - red(accentColor1) * mIntensity,
                //      green(accentColor1) - green(accentColor1) * mIntensity,
                //      blue(accentColor1) - blue(accentColor1) * mIntensity);
                
                rect(x + X_OFFSET, y + Y_OFFSET, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }

    // tint(255, 127);
    // image(vid, X_OFFSET, Y_OFFSET);

    // Marco
    noFill();
    stroke(ACCENT_SECOND_COLOR);  
    strokeWeight(45);   
    rect(0, 0, WIDTH, HEIGHT);  
}

