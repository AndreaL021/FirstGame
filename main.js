window.onload = () => {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    let jump = document.getElementById('jump');
    let start = document.getElementById('start');
    jump.style.display = "none";
    start.style.display = "none";
    // w,h campo
    let width = 1500;
    let height = 700;
    // x,y player
    var x = 150;
    var y = 100;
    let t;
    // forza di gravita
    let speed = 0;
    // punteggio
    let count = 0;
    // frame/s
    let fps = 0;
    /* variabile usata per settare l'aggiornamento dello 
    span ogni 100ms invece di 16ms */
    let fpsSpan;
    let playerDeath = false;
    var interval;
    var animation;
    var addscore;
    let ob2start = false;

    class Obstacle {
        constructor(arg = undefined) {
            if (arg != undefined) {
                const campi = this.setCampi();
                campi.forEach((c) => {
                    this[c.nome] = arg[c.nome] != undefined ? arg[c.nome] : c.default_val;
                });
            } else {
                const campi = this.setCampi();
                campi.forEach((c) => {
                    this[c.nome] = c.default_val;
                });
            }
        }
        // Metodo per resettare tutti i campi
        reset() {
            const campi = this.setCampi();

            campi.forEach((c) => {
                this[c.nome] = c.default_val;
            });
        }
        setCampi() {
            const campi = [
                // parte sopra
                { nome: "h", default_val: null },
                { nome: "w", default_val: 50 },
                { nome: "x", default_val: 1600 },
                { nome: "y", default_val: 0 },
                // parte sotto
                { nome: "y2", default_val: null },
                { nome: "h2", default_val: null },
                { nome: "speed", default_val: 6 }
            ];

            return campi;
        }
    }

    let ob = new Obstacle;
    ob.h = 80 + Math.floor(Math.random() * 400);
    ob.y2 = ob.h + 180;
    ob.h2 = height - ob.h;
    ob.x = 1600;
    let ob2 = new Obstacle;
    ob2 = JSON.parse(JSON.stringify(ob));
    ob2.x = 1600;

    function obdraw() {
        // reset posizione ostacolo se esce dallo schermo
        if (ob.x < -100) {
            ob.h = 100 + Math.floor(Math.random() * 400);
            ob.y2 = ob.h + 180;
            ob.h2 = height - ob.h;
            ob.x = 1600;
        }
        // ostacolo
        // alto
        context.beginPath();
        context.rect(ob.x, ob.y, ob.w, ob.h);
        context.fillStyle = "red";
        context.fill();
        // basso
        context.beginPath();
        context.rect(ob.x, ob.y2, ob.w, ob.h2);
        context.fillStyle = "red";
        context.fill();
    }

    function ob2draw() {
        // reset posizione ostacolo se esce dallo schermo
        if (ob2.x < -100) {
            ob2.h = 100 + Math.floor(Math.random() * 400);
            ob2.y2 = ob2.h + 180;
            ob2.h2 = height - ob2.h;
            ob2.x = 1600;
        }
        // ostacolo 2
        // alto
        context.beginPath();
        context.rect(ob2.x, ob2.y, ob2.w, ob2.h);
        context.fillStyle = "red";
        context.fill();
        // basso
        context.beginPath();
        context.rect(ob2.x, ob2.y2, ob2.w, ob2.h2);
        context.fillStyle = "red";
        context.fill();



    }

    // Comandi
    jump.onmousedown = function () {
        speed = 0
        y -= 10;
        speed = -250
    }
    document.onkeydown = function () {
        speed = 0
        y -= 10;
        speed = -250
    }
    document.ontouchstart = function () {
        speed = 0
        y -= 10;
        speed = -250
    }
    // png player
    var img = new Image();
    img.src = "./png/img1.png";
    img.onload = function () {
        start.style.display = "inline";
    };
    // png playerfly
    var imgup = new Image();
    imgup.src = "./png/imgup.png";
    imgup.onload = function () {
        start.style.display = "inline";
    };
    // png playerfall
    var imgdown = new Image();
    imgdown.src = "./png/imgdown.png";
    imgdown.onload = function () {
        start.style.display = "inline";
    };
    // pulsante START
    start.onmousedown = function () {
        t = Date.now();
        context.clearRect(0, 0, width, height);
        start.style.display = "none";
        jump.style.display = "inline";
        x = 150;
        y = 100;
        speed = 0;
        ob.speed = 6;
        ob.x = 1600;
        ob2.speed = 6;
        ob2.x = 1600;
        playerDeath = false;
        draw();
        interval = setInterval(frames, 100);
        addscore = setInterval(score, 1000);
        /* dopo il primo click tolgo le funzioni draw 
        e setinterval perche causano bug se ripetute*/
        start.onmousedown = function () {
            t = Date.now();
            context.clearRect(0, 0, width, height);
            start.style.display = "none";
            jump.style.display = "inline";
            x = 150;
            y = 100;
            ob.x = 1600;
            ob.h = 100 + Math.floor(Math.random() * 400);
            ob.y2 = ob.h + 180;
            ob.h2 = height - ob.h;
            ob.speed = 6;
            ob2.x = 1600;
            ob2.h = 100 + Math.floor(Math.random() * 400);
            ob2.y2 = ob2.h + 180;
            ob2.h2 = height - ob2.h;
            ob2.speed = 6;
            speed = 0;
            playerDeath = false;
            ob2start = false;
            draw();
            interval = setInterval(frames, 100);
            addscore = setInterval(score, 1000);
            // riattivo i comandi che vengono disattivati alla morte
            document.onkeydown = function () {
                speed = 0
                y -= 10;
                speed = -250
            }
            document.ontouchstart = function () {
                speed = 0
                y -= 10;
                speed = -250
            }
        }
    }

    // DRAW
    function draw() {
        if (playerDeath === false) {
            var timePassed = (Date.now() - t) / 1000;
            t = Date.now();
            fps = Math.round(1 / timePassed);
            //Pulisci campo di gioco
            context.clearRect(0, 0, width, height);
            // GRAVITA
            if (y <= height) {
                if (speed <= 500) {
                    speed += 300 * timePassed;
                    y += speed * timePassed;

                } else {
                    y += speed * timePassed;
                }
            }
            // MORTE PER GRAVITA
            if (y >= height) {
                death();
            }
            /*bocco per non permettere al giocatore 
            di uscire dallo schermo saltando*/
            y < 50 ? y = 50 : y

            // player
            context.beginPath();
            context.drawImage(img, x - 50, y - 45, 90, 80);

            // immagini volo/caduta
            // if (speed<150 && speed>-150)
            //     context.drawImage(img, x-50, y-45, 90, 80);
            // else if (speed>150)
            //     context.drawImage(imgdown, x-50, y-45, 120, 100);
            // else if (speed<-150)
            //     context.drawImage(imgup, x-50, y-45, 120, 100);

            // sagoma collisioni
            // context.arc(x, y, 35, 0, 2 * Math.PI);
            // context.fillStyle = "red";
            // context.fill();


            // spostamento ostacolo
            ob.x -= ob.speed
            // disegno l'ostacolo
            obdraw();
            // collisione con l'ostacolo
            if (x + 35 >= ob.x && x - 35 <= ob.x + 50 && y - 35 <= ob.h) {
                death();
            } else if (x + 35 >= ob.x && x - 35 <= ob.x + 50 && y + 35 >= ob.y2) {
                death();
            }
            if (ob.x < 750) ob2start = true;
            if (ob2start === true) {
                ob2.x -= ob2.speed
                ob2draw();
                if (x + 35 >= ob2.x && x - 35 <= ob2.x + 50 && y - 35 <= ob2.h) {
                    death();
                } else if (x + 35 >= ob2.x && x - 35 <= ob2.x + 50 && y + 35 >= ob2.y2) {
                    death();
                }
            }
            // fps
            context.font = '25px Arial';
            context.fillStyle = 'white';
            context.fillText("Score: " + count, 20, 30);
            context.fillText("FPS: " + fpsSpan, 1350, 30);
            animation = window.requestAnimationFrame(draw);
        } else {
            context.beginPath();
            context.font = '50px Arial';
            context.fillStyle = "white"
            context.fillText("Game Over", 700, 300);
        }
    }
    function frames() {
        fpsSpan = fps;
    }
    function score() {
        count++;
    }
    function death() {
        console.log(ob, ob2);
        ob2start = false;
        clearInterval(interval);
        clearInterval(addscore);
        cancelAnimationFrame(animation);
        playerDeath = true;
        ob.speed = 0;
        ob2.speed = 0;
        count = 0;
        jump.style.display = "none";
        start.style.display = "inline";
        start.innerHTML = "Restart";
        document.onkeydown = function () { }
        document.ontouchstart = function () { }
    }

}