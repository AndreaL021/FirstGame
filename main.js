window.onload = () => {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    let start = document.getElementById('start');
    let hard = document.getElementById('hard');
    let hardLabel = document.getElementById('hardLabel');
    hardLabel.style.display = "inline";
    start.style.display = "none";
    // w,h campo
    let width = 1500;
    let height = 700;
    // x,y player
    var x = 150;
    var y = 100;
    let t;
    let bgx = 0;
    let bgx2 = bgx+1500;
    // forza di gravita
    let speed = 0;
    // punteggio
    let count = 0;
    let bestscore= [];
    // frame/s
    let fps = 0;
    /* variabile usata per settare l'aggiornamento dello 
    span ogni 100ms invece di 16ms */
    let fpsSpan;
    let playerDeath = false;
    var interval;
    var animation;
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
        
        context.strokeStyle = "black";
        // reset posizione ostacolo se esce dallo schermo
        if (ob.x < -100) {
            ob.h = 30 + Math.floor(Math.random() * 400);
            ob.y2 = ob.h + 180;
            ob.h2 = height - ob.h;
            ob.x = 1600;
            count++
        }
        // ostacolo
        // alto
        context.beginPath();
        context.lineWidth = 4;
        context.rect(ob.x+2, ob.y, ob.w-4, ob.h-30);
        context.fillStyle = "green";
        context.fill();
        context.stroke();
        context.beginPath();
        context.lineWidth = 4;
        context.rect(ob.x-2, ob.h-30, ob.w+4, 30);
        context.fillStyle = "green";
        context.fill();
        context.stroke();
        // basso
        context.beginPath();
        context.rect(ob.x+2, ob.y2+30, ob.w-4, ob.h2);
        context.lineWidth = 4;
        context.fillStyle = "green";
        context.fill();
        context.stroke();
        context.beginPath();
        context.lineWidth = 4;
        context.rect(ob.x-2, ob.y2, ob.w+4, 30);
        context.fillStyle = "green";
        context.fill();
        context.stroke();
    }

    function ob2draw() {
        context.strokeStyle = "black";
        // reset posizione ostacolo se esce dallo schermo
        if (ob2.x < -100) {
            ob2.h = 30 + Math.floor(Math.random() * 400);
            ob2.y2 = ob2.h + 180;
            ob2.h2 = height - ob2.h;
            ob2.x = 1600;
            count++
        }
        // ostacolo 2
        // alto
        context.beginPath();
        context.rect(ob2.x+2, ob2.y, ob2.w-4, ob2.h-30);
        context.lineWidth = 4;
        context.fillStyle = "green";
        context.fill();
        context.stroke();
        context.beginPath();
        context.lineWidth = 4;
        context.rect(ob2.x-2,ob2.h-30, ob.w+4, 30);
        context.fillStyle = "green";
        context.fill();
        context.stroke();
        // basso
        context.beginPath();
        context.rect(ob2.x+2, ob2.y2+30, ob2.w-4, ob2.h2);
        context.lineWidth = 4;
        context.fillStyle = "green";
        context.fill();
        context.stroke();
        context.beginPath();
        context.lineWidth = 4;
        context.rect(ob2.x-2, ob2.y2, ob.w+4, 30);
        context.fillStyle = "green";
        context.fill();
        context.stroke();

        // context.rect(ob.x+2, ob.y2+30, ob.w-4, ob.h2);
        // context.lineWidth = 4;
        // context.fillStyle = "green";
        // context.fill();
        // context.stroke();
        // context.beginPath();
        // context.lineWidth = 4;
        // context.rect(ob.x-2, ob.y2, ob.w+4, 30);


    }

    // START
    document.onkeydown = function (key) {
        if (key.keyCode===32) {
            start.onmousedown();
        }
    }
    // background
    var bg = new Image();
    bg.src = "./png/background.png";
    // png player
    var img = new Image();
    img.src = "./png/img1.png";
    // pulsante START
    start.onmousedown = function () {
        count = 0;
        t = Date.now();
        context.clearRect(0, 0, width, height);
        start.style.display = "none";
        hardLabel.style.display = "none";
        x = 150;
        y = 100;
        ob.x = 1600;
        ob.h = 100 + Math.floor(Math.random() * 400);
        ob.y2 = ob.h + 180;
        ob.h2 = height - ob.h;
        ob.speed =  hard.checked===false ? 470 : 700;
        ob2.x = 1600;
        ob2.h = 100 + Math.floor(Math.random() * 400);
        ob2.y2 = ob2.h + 180;
        ob2.h2 = height - ob2.h;
        ob2.speed =  hard.checked===false ? 470 : 700;
        speed = 0;
        playerDeath = false;
        ob2start = false;
        draw();
        interval = setInterval(frames, 100);
        // riattivo i comandi che vengono disattivati alla morte
        document.onkeydown = function (key) {
            if (key.keyCode===32 || key.keyCode===87) {
                if (speed>0) speed = 0;
                speed = -400
            }
        }
        document.ontouchstart = function () {
            if (speed>0) speed = 0;
            speed = -400
        }
        
        
    }
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // Codice da eseguire nel caso di un dispositivo mobile
        start.style.display = "inline";
    }
    context.beginPath();
    context.font = 'bold 40px Arial';
    context.fillStyle = "red";
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // Codice da eseguire nel caso di un dispositivo mobile
        context.fillText("Press start", 650, 300);
        context.fillText("Tap anywhere to jump", 570, 350);
        // console.log(navigator.userAgent);
    }else{
        // Codice da eseguire nel caso di un dispositivo tradizionale
        context.fillText("Press space to start game", 495, 300);
        context.fillText("Press w or space to jump", 500, 350);
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
                if (speed <= 600) {
                    speed = hard.checked===false 
                    ? speed + 600 * timePassed 
                    : speed + 500 * timePassed * 1.5;
                    y = hard.checked===false 
                    ? y + speed * timePassed
                    : y + speed * timePassed * 1.5

                } else {
                    y = hard.checked===false 
                    ? y + speed * timePassed
                    : y + speed * timePassed * 1.5
                }
            }
            // MORTE PER GRAVITA
            if (y >= height) {
                death();
            }
            /*bocco per non permettere al giocatore 
            di uscire dallo schermo saltando*/
            y < 50 ? y = 50 : y
            bgx = hard.checked===false
                ? bgx-100*timePassed
                : bgx-200*timePassed;
            bgx2 = hard.checked===false
                ? bgx2-100*timePassed
                : bgx2-200*timePassed;
            if (bgx<-1500) {
                bgx=1500
                // console.log('resetbg');
            }
            if (bgx2<-1500) {
                bgx2=bgx+1500
            }
            context.beginPath();
            context.drawImage(bg, bgx, 0, 1510, 710);
            context.drawImage(bg, bgx2, 0, 1510, 710);

            // salvo il context 
            context.save();
            // sposto la sua origine
            context.translate( x, y);
            // ruoto il context
            if (speed>10) {
                context.rotate(speed/11*Math.PI/180);
                
            }else if(speed<-10){
                context.rotate(speed/6*Math.PI/180);

            }else{
                context.rotate(0*Math.PI/180);
            }
            // disegno il personaggio con il context ruotato
            context.drawImage(img, 0 - 50, 0 - 45, 90, 80);
            // reset context
            context.restore();
            // sagoma collisioni
            // context.beginPath();
            // context.rect(x - 30, y-30,(x+30)-(x-30), (y+30)-(y-30));
            // context.arc(x, y, 35, 0, 2 * Math.PI);
            // context.fillStyle = "red";
            // context.fill();
            



            // spostamento ostacolo
            ob.x -= ob.speed*timePassed;
            // disegno l'ostacolo
            obdraw();
            // calcola la distanza tra il centro del cerchio e i bordi del quadrato
            let dx = Math.max(ob.x-10 - x, 0, x - (ob.x + ob.w));
            let dy = Math.max(ob.y - y, 0, y - (ob.y + ob.h));
            let dy2 = Math.max(ob.y2 - y, 0, y - (ob.y2 + ob.h));
            // collisione con l'ostacolo
            // cerchio
            if (dx * dx + dy * dy <= 35 * 35 || dx * dx + dy2 * dy2 <= 35 * 35) {
                death();
            }
            // quadrato
            // if (x + 30 >= ob.x-4 && x - 30 <= ob.x + 40 && y - 30 <= ob.h) {
            //     death();
            // } else if (x + 30 >= ob.x-4 && x - 30 <= ob.x + 40 && y + 30 >= ob.y2) {
            //     death();
            // }
            if (ob.x < 750) ob2start = true;
            if (ob2start === true) {
                ob2.x -= ob2.speed*timePassed
                ob2draw();
                // calcola la distanza tra il centro del cerchio e i bordi del quadrato
                let dx = Math.max(ob2.x-4 - x, 0, x - (ob2.x + ob.w));
                let dy = Math.max(ob2.y - y, 0, y - (ob2.y + ob2.h));
                let dy2 = Math.max(ob2.y2 - y, 0, y - (ob2.y2 + ob2.h));
                // collisione con l'ostacolo
                if (dx * dx + dy * dy <= 35 * 35 || dx * dx + dy2 * dy2 <= 35 * 35) {
                    death();
                }
                // if (x + 30 >= ob2.x-4 && x - 30 <= ob2.x + 50 && y - 30 <= ob2.h) {
                //     death();
                // } else if (x + 30 >= ob2.x-4 && x - 30 <= ob2.x + 50 && y + 30 >= ob2.y2) {
                //     death();
                // }
            }
            // fps
            context.font = 'bold 25px Arial';
            context.fillStyle = 'white';
            context.fillText("Score: " + count, 20, 30);
            context.fillText("FPS: " + fpsSpan, 1350, 30);
            animation = window.requestAnimationFrame(draw);
        } else {
            context.beginPath();
            context.font = 'bold 50px Arial';
            context.fillStyle = "red"
            context.fillText("Game Over", 650, 300);
            context.font = 'bold 40px Arial';
            context.fillText("Current Score: "+ count, 650-15, 380);
            context.fillText("Best Score: " + Math.max.apply(Math, bestscore), 650, 420);
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                // Codice da eseguire nel caso di un dispositivo mobile
                context.fillText("Press restart to retry", 600, 470);
            }else{
                // Codice da eseguire nel caso di un dispositivo tradizionale
                context.fillText("Press space to restart the game", 495, 470);
            }
        }
    }
    function frames() {
        fpsSpan = fps;
    }
    function death() {
        bestscore.push(count);
        ob2start = false;
        clearInterval(interval);
        cancelAnimationFrame(animation);
        playerDeath = true;
        ob.speed = 0;
        ob2.speed = 0;
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            // Codice da eseguire nel caso di un dispositivo mobile
            start.style.display = "inline";
        }
        hardLabel.style.display = "inline";
        start.innerHTML = "Restart";
        document.onkeydown = function (key) { 
            if (key.keyCode===32) {
                start.onmousedown();
            }
        }
        document.ontouchstart = function () { }
    }

}