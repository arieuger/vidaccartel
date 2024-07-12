const PIXEL_SIZE = 30;

const WIDTH = 600;
const HEIGHT = WIDTH * 1.414;

const X_OFFSET = -300;
const Y_OFFSET = -220;

const VID_RATIO = 1.5;

const ACCENT_COLOR = "#ec1932";
let accentColor;

// Ctrl + Shift + A -> Use JavaScript Library
function setup() {
    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.id("p5jsCanvas");
    vid = createVideo("media/fuego_144p.mp4");
    vid.size(HEIGHT * VID_RATIO, HEIGHT * VID_RATIO);

    vid.volume(0);
    vid.loop();
    vid.hide();

    accentColor = color(ACCENT_COLOR);
}

function draw() {
    background("#256758");
    
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
            
            if (mIntensity < 0.5) {
                
                // Para usar a cor orixinal:
                // fill(vid.pixels[i * 4], vid.pixels[i * 4 + 1] - 40, vid.pixels[i * 4 + 2]);
                
                // Para usar unha cor gradiente en intensidade:
                fill(red(accentColor) - red(accentColor) * mIntensity,
                    green(accentColor) - green(accentColor) * mIntensity,
                    blue(accentColor) - blue(accentColor) * mIntensity, );
                
                rect(x + X_OFFSET, y + Y_OFFSET, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }

    // tint(255, 127);
    // image(vid, X_OFFSET, Y_OFFSET);

    // Marco
    noFill();
    stroke(ACCENT_COLOR);  
    strokeWeight(45);   
    rect(0, 0, WIDTH, HEIGHT);  
}