const PIXEL_SIZE = 5;

const WIDTH = 600;
const HEIGHT = Math.trunc(WIDTH * 1.414);

const X_OFFSET = -65;
const Y_OFFSET = 125;

const VID_RATIO = 1;

const MARGIN_SIZE = 20;

const ACCENT_FIRST_COLOR = "#25673f";
const ACCENT_SECOND_COLOR = "#ff5959";
const BACKGROUND_COLOR = "#f8c7b3";
let accentColor1;
let accentColor2;

let bgPattern;


let minColorValue = 255; // Inicialmente, el valor más alto posible
let maxColorValue = 155; // Inicialmente, el valor más bajo posible

let colorValues = [];
// Ctrl + Shift + A -> Use JavaScript Library

function preload() {    
    vid = createVideo("media/si2-c-sm-t.mp4");
    vid.size(720 * VID_RATIO, 766 * VID_RATIO);

    vid.volume(0);
    vid.loop();
    vid.hide();
}

function setup() {
    canvas = createCanvas(WIDTH, HEIGHT);
    canvas.id("p5jsCanvas");

    accentColor1 = color(ACCENT_FIRST_COLOR);
    accentColor2 = color(ACCENT_SECOND_COLOR);
    
    bgPattern = createGraphics(WIDTH, HEIGHT);
    
    bgPattern.loadPixels();
    
    let incremento = 0.3;
    let detalle = 5;
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            // Posición normalizada
            let posX = x / WIDTH;
            let posY = y / HEIGHT;
            
            let perlNoise = 0;
            let amplitude = 3;
            let frecuencia = incremento;
            for (let i = 0; i < detalle; i++) {
                perlNoise += noise(posX * frecuencia, posY * frecuencia) * amplitude;
                amplitude *= 0.5; // Reducir la amplitud para cada octava
                frecuencia *= 2; // Duplicar la frecuencia para cada octava
            }

            let colorValue = map(perlNoise, 0, detalle, 155, 255);
            colorValues.push(colorValue);

            if (colorValue < minColorValue) minColorValue = colorValue;
            if (colorValue > maxColorValue) maxColorValue = colorValue;
            
        }
    }

    let minMapped = 155;
    let maxMapped = 255;

    for (let i = 0; i < colorValues.length; i++) {
        colorValues[i] = map(colorValues[i], minColorValue, maxColorValue, minMapped, maxMapped);
    }

    let index = 0;
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            let colorValue = colorValues[index];
            index++;

            if (random(1) < 0.6) {
                if (colorValue >= maxMapped - 33)
                    colorValue -= colorValue * 0.2;
                else if (colorValue <= minMapped + 33)
                    colorValue += colorValue * 0.2;
                else
                    colorValue += colorValue * random(-0.2, 0.2);
            }

            let newColor = color(colorValue);
            bgPattern.set(x, y, newColor);
        }
    }
    
    bgPattern.updatePixels();
    
}
function draw() {

    blendMode(BLEND);
    background(BACKGROUND_COLOR);
    blendMode(DARKEST);
    image(bgPattern, 0, 0);

    blendMode(DIFFERENCE);
    vid.loadPixels();

    setVideo();
    
    // tint(255, 127);
    // image(vid, X_OFFSET, Y_OFFSET);
    blendMode(BLEND);

    blendMode(MULTIPLY);
    setText();
    // blendMode(LIGHTEST);

    blendMode(SOFT_LIGHT);
    setFrame();
    

}


function setVideo() {

    noStroke();

    for (let y = MARGIN_SIZE; y < canvas.height + Math.abs(Y_OFFSET) - MARGIN_SIZE; y += PIXEL_SIZE) {
        for (let x = MARGIN_SIZE; x < canvas.width + Math.abs(X_OFFSET) - MARGIN_SIZE; x += PIXEL_SIZE) {
            const i = y * vid.width + x;

            // El valor en la posición i * 4     corresponde al componente rojo (R) del píxel.
            // El valor en la posición i * 4 + 1 corresponde al componente verde (G) del píxel.
            // El valor en la posición i * 4 + 2 corresponde al componente azul (B) del píxel.
            // El valor en la posición i * 4 + 3 corresponde al componente alfa (A) del píxel.

            const rIntensity = (255 - vid.pixels[i * 4]) / 255;
            const gIntensity = (255 - vid.pixels[i * 4] + 1) / 255;
            const bIntensity = (255 - vid.pixels[i * 4] + 2) / 255;
            const mIntensity = (rIntensity + gIntensity + bIntensity) / 3;

            if (mIntensity < 0.95) {
                // Para usar a cor orixinal:
                // fill(vid.pixels[i * 4], vid.pixels[i * 4 + 1] - 40, vid.pixels[i * 4 + 2]);

                // Usar degradado
                // Obter ubicación en Y do canvas como porcentaxe                
                let normalizedY = (y + Y_OFFSET) / (HEIGHT - MARGIN_SIZE * 2);
                let colorToFill = lerpColor(accentColor1, accentColor2, normalizedY);

                // Para usar unha sola cor
                fill(colorToFill);


                // fill(accentColor1);
                // Para usar unha cor gradiente en intensidade:
                // fill(red(accentColor1) - red(accentColor1) * mIntensity,
                //      green(accentColor1) - green(accentColor1) * mIntensity,

                //      blue(accentColor1) - blue(accentColor1) * mIntensity);
                
                rect(x + X_OFFSET, y + Y_OFFSET, PIXEL_SIZE, PIXEL_SIZE);
            }
        }
    }
}


function setText() {
    textStyle(BOLD);

    fill("#f83963");
    textSize(135);
    textFont('Poppins');
    text("ACCIÓN", 20, 190);

    // textStyle(NORMAL);
    fill("#23b68d");
    textSize(60);
    textFont('Poppins');
    text("ESQUERDA", 20, 80);

    fill("#61d3ab");
    textSize(60);
    textFont('Poppins');
    text("ABAIXO", 340, 80);

    fill("#ef6784");
    textSize(36);
    textFont('Poppins');
    text("Videoxogos e anticapitalismo", 20, 240);
}

function setFrame() {
    // noFill();
    // stroke(ACCENT_SECOND_COLOR);  
    // strokeWeight(MARGIN_SIZE);   
    // rect(0, 0, WIDTH, HEIGHT);  

    // Marco Gradient
    for (let i = 0; i < HEIGHT; i += PIXEL_SIZE) {
        let normalizedY = i / HEIGHT;
        let colorToFill = lerpColor(accentColor1, accentColor2, normalizedY)
        fill(colorToFill);

        if (i === 0) {
            rect(0, i, WIDTH, MARGIN_SIZE);
        } else {
            rect(0, i, MARGIN_SIZE, MARGIN_SIZE);
            rect(WIDTH - MARGIN_SIZE, i, MARGIN_SIZE, MARGIN_SIZE);
        }
    }

    fill(accentColor2);
    rect(0, HEIGHT - MARGIN_SIZE, WIDTH, MARGIN_SIZE)

}

