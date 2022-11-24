window.onload = () => {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    let jump=document.getElementById('jump');
    let start=document.getElementById('start');
    jump.style.display="none";
    start.style.display="none";
    // w,h campo
    let width=1500;
    let height=600;
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
    // punto di partenza ostacoli
    var obx=1600;
    var oby=0;
    // altezza variabile ostacolo alto
    var heightob=Math.floor(Math.random()*400);
    /* la parte bassa dell'ostacolo inizia 100px 
    piu in basso della fine della parte alta */
    var ob2y=heightob+180;
    // altezza ostacolo basso
    var heightob2= height-heightob;
    // velocita di movimento ostacoli
    let obspeed = 5;
    let playerDeath=false;
    var interval;
    var animation;
    var addscore;



    // Comandi
    jump.onmousedown= function(){
        speed=0
        y -= 10;
        speed=-250
    }
    document.onkeydown = function () {
        speed=0
        y -= 10;
        speed=-250
    }
    document.ontouchstart = function () {
        speed=0
        y -= 10;
        speed=-250
    }
    // png player
    var img = new Image();
    img.src= "./png/img1.png" ;
    img.onload = function() {
        start.style.display="inline";
    };
    // pulsante START
    start.onmousedown= function(){
        t = Date.now();
        context.clearRect(0, 0, width, height);
        start.style.display="none";
        jump.style.display="inline";
        x = 150;
        y = 100;
        speed=0;
        obspeed = 5;
        obx=1600;
        oby=0;
        playerDeath=false;
        draw();
        interval= setInterval(frames, 100); 
        addscore= setInterval(score, 1000); 
        /* dopo il primo click tolgo le funzioni draw 
        e setinterval perche causano bug se ripetute*/
        start.onmousedown= function(){
            t = Date.now();
            context.clearRect(0, 0, width, height);
            start.style.display="none";
            jump.style.display="inline";
            x = 150;
            y = 100;
            obx=1600;
            oby=0;
            heightob=Math.floor(Math.random()*400);
            ob2y=heightob+180;
            heightob2= height-heightob;
            speed=0;
            obspeed = 5;
            playerDeath=false;
            draw();
            interval= setInterval(frames, 100); 
            addscore= setInterval(score, 1000); 
            // riattivo i comandi che vengono disattivati alla morte
            document.onkeydown = function () {
                speed=0
                y -= 10;
                speed=-250
            }
            document.ontouchstart = function () {
                speed=0
                y -= 10;
                speed=-250
            }
        }
    }
    
    // DRAW
    function draw() {
        if (playerDeath===false) {
            var timePassed = (Date.now() - t) / 1000;
            t = Date.now();
            fps = Math.round(1 / timePassed);
            // spostamento ostacolo
            obx-=obspeed
            //Pulisci campo di gioco
                context.clearRect(0, 0, width, height);
            // GRAVITA
            if (y <= height) {
                if (speed<=500) {
                    speed += 300 * timePassed;
                    y += speed * timePassed;
                    
                }else{
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
            // collisione con l'ostacolo        && x-35<=obx+50  && y+35>=heightob
            if (x+35>=obx && x-35<=obx+50 && y-35<=heightob ) {
                death();
            }else if (x+35>=obx && x-35<=obx+50 && y+35>=ob2y) {
                death();
            }
            // player
            context.beginPath();
            context.drawImage(img, x-50, y-45, 90, 80);
            // sagoma collisioni
            // context.arc(x, y, 35, 0, 2 * Math.PI);
            // context.fillStyle = "red";
            // context.fill();

            // reset posizione ostacolo se esce dallo schermo
            if (obx<-55) {
                heightob=Math.floor(Math.random()*400);
                ob2y=heightob+180;
                heightob2= height-heightob;
                obx=1600;
            }
         // ostacolo
            // alto
            context.beginPath();
            context.rect(obx, oby, 50, heightob);
            context.fillStyle = "red";
            context.fill();
            // basso
            context.beginPath();
            context.rect(obx, ob2y, 50, heightob2);
            context.fillStyle = "red";
            context.fill();
            // fps
            context.font = '25px Arial';
            context.fillStyle = 'white';
            context.fillText("Score: " + count, 20, 30);
            context.fillText("FPS: " + fpsSpan, 1350, 30);
            animation=window.requestAnimationFrame(draw);
        }
        // else{
        //     console.log('ok');
        //     return;
        // }
    }
    function frames() {
        fpsSpan=fps;
    }
    function score(){
        count ++;
    }
    function death() {
        clearInterval(interval);
        clearInterval(addscore);
        cancelAnimationFrame(animation);
        playerDeath=true;
        obspeed=0;
        count = 0;
        context.beginPath();
        context.font = '50px Arial';
        context.fillStyle="white"
        context.fillText("Game Over", 700, 300); 
        jump.style.display="none";
        start.style.display="inline";
        start.innerHTML="Restart"
        document.onkeydown = function () {}
        document.ontouchstart = function () {}
    }

}