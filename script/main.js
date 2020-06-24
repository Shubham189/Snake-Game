let interval;
let body = []; //contains all the index where body is present
let state = 0; // 0->right, 1->down, 2- left, 3 is up;
let N = 20;
let size = 520; //canvas size
let speed = 300;
let speed_normal = 300;
let speed_fast = 150 ;
let score = 0;
let dead = false;
let paused = false;
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = "#A7D948"; //green
ctx.fillRect(0, 0, size, size); 

//To pause and un-pause the game
function isPaused()
{
    if(!dead)
    {
        if (!paused)
        {
            paused = true;
        } 
        else if (paused)
        {
            paused = false;
        }

        if(paused)
        {
            clearInterval(interval);
            document.getElementById("pause").innerHTML="Paused!!  (Press 'p' again to continue!!)";
        }	
        else if(!paused)
        {
            interval=setInterval(update,speed);	
            document.getElementById("pause").innerHTML="";
        }
    }    	
}

//To increase the speed of the snake
function inc_speed()
{
    if(speed == speed_normal)
        speed = speed_fast;	
}

//To decrease the speed of the snake
function dec_speed()
{
    if(speed == speed_fast)
        speed = speed_normal;	
}

//To check if the snake is dead or not
function checkDead()
{
    for (let i = 1; i < body.length; i++){
        if(body[i][0]==body[0][0] && body[i][1]==body[0][1])
            dead=true;
    }
}

//To reload the canvas
function reload()
{
    clearInterval(interval);
    interval=setInterval(update,speed);
}

//To handle the keys pressed 
function handleKey(e) {
    e = e || window.event;
    let play = false;
    let prev_state=state;
    speed=speed_normal;
    //key P to pause and un-pause the game
    if(e.keyCode == '80')
        isPaused();
    if(!paused && !dead)
    {
        //change direction
        // 0->right, 1->down, 2- left, 3 is up;
        //38 -> up arrow, 40 -> down arrow, 37 -> left arraw, 39 -> right arrow;
        if (e.keyCode == '38' && state!=1 && state!=3) {
            // up arrow
            state = 3;
            play = true;
            update();
            reload();
        }
        else if (e.keyCode == '40' && state!=1 && state!=3) {
            // down arrow
            state = 1;
            play = true;
            update();
            reload();
        }
        else if (e.keyCode == '37' && state!=0 && state!=2) {
        // left arrow
            state = 2;
            play = true;
            update();
            reload();
        }
        else if (e.keyCode == '39' && state!=0 && state!=2) {
        // right arrow
            state = 0;
            play = true;
            update();
            reload();
        }
        //increase speed
        // 0->right, 1->down, 2- left, 3 is up;
        //38 -> up arrow, 40 -> down arrow, 37 -> left arraw, 39 -> right arrow;
        else if(e.keyCode == '38' && state==prev_state && state==3)
        {
            inc_speed();
            reload();
        }
        else if(e.keyCode == '40' && state==prev_state && state==1)
        {
            inc_speed();
            reload();
        }
        else if(e.keyCode == '37' && state==prev_state && state==2)
        {
            inc_speed();
            reload();
        }
        else if(e.keyCode == '39' && state==prev_state && state==0)
        {
            inc_speed();
            reload();
        }
        //decrease speed
        // 0->right, 1->down, 2- left, 3 is up;
        //38 -> up arrow, 40 -> down arrow, 37 -> left arraw, 39 -> right arrow;
        else if(e.keyCode == '38' && state==1)
        {
            dec_speed();
            reload();
        }
        else if(e.keyCode == '40' && state==3)
        {
            dec_speed();
            reload();
        }
        else if(e.keyCode == '37' && state==0)
        {
            dec_speed();
            reload();
        }
        else if(e.keyCode == '39' && state==2)
        {
            dec_speed();
            reload();
        }
        if(play)
        playAudio();
    }
}

//For handling keys
document.onkeydown = handleKey;

//To play audio when a key is pressed
function playAudio(){
    let audio = new Audio('sounds/press.wav');
    audio.play();			
}

//To play audio when the snake consumes food
function playConsume(){			
    let audio = new Audio('sounds/eat.mp3');
    audio.play();			
}

let cellSize = size/N;

//To draw the grid
function drawCell(i,j){
    if( (i+j)%2==0 ) {
        ctx.fillStyle = ("#8ECC39"); //dark green
    }else{
    ctx.fillStyle = "#A7D948"; //light green
    }
    ctx.fillRect(cellSize*i, cellSize*j, cellSize, cellSize);
}

for (let i = 0; i < N; i++){
    for (let j = 0; j < N; j++){
        drawCell(i,j);
    }
}

body.push([1+ N/2,N/2]);
body.push([N/2,N/2]);
body.push([-1+N/2,N/2]);

//Load the image of the eyes
let eyeImage = new Image();
eyeImage.src = "images/eyes.png";

//Load the image of the food
let foodImage = new Image();
foodImage.src = "images/food.png";

let counter = 0;
let foodX = 0;
let foodY = 0;

//Generate food randomly where there is no snake
function generateFood(){
    
    let success = false;
    while(!success){
        foodX = parseInt(Math.random()*N);
        foodY = parseInt(Math.random()*N);

        success = true;
        for(let i=0;i<body.length;i++){
            if(body[i][0]==foodX && body[i][1]==foodY){
                success = false;
            }
        }
    }
}

generateFood();

//To update the canvas
function update(){
    if(dead)
    {
        document.getElementById("dead").innerHTML="DEAD!!!   (Refresh to play again!!)";
        clearInterval(interval);
    }	
    counter++;
    let increase = false;
    if(body[0][0]==foodX && body[0][1]==foodY){
        score++;
        document.getElementById("score").innerHTML="Score : "+score;
        generateFood();
        playConsume();
        increase = true;
    }

    for (let i = 0; i < N; i++){
        for (let j = 0; j < N; j++){
            drawCell(i,j);
        }
    }

    //To draw the food
    ctx.drawImage(foodImage,
                foodX*cellSize, foodY*cellSize,
                cellSize, cellSize);

    //To draw the body
    for(let i=0;i<body.length;i++){
        ctx.fillStyle = ("#527DF9");
        ctx.fillRect(cellSize*body[i][0], cellSize*body[i][1], cellSize, cellSize);

        //To draw the eyes
        if(i==0){
            let marginX = cellSize/3;
            let marginY = cellSize/3;
            
            if(state==0||state==2){
                marginX=0;
            }else if (state==1||state==3){
                marginY=0;
            }

            ctx.drawImage(eyeImage,
                0,28*(counter%9),
                cellSize,cellSize,
                cellSize*body[i][0]+marginX, 
                cellSize*body[i][1]+marginY,
                cellSize, cellSize);
            ctx.drawImage(eyeImage,
                0,28*(counter%9),
                cellSize,cellSize,
                cellSize*body[i][0]-marginX, 
                cellSize*body[i][1]-marginY, 
                cellSize, cellSize);
        }
    }	

    //To update the position of the body
    // 0->right, 1->down, 2- left, 3 is up;
    let x = 0;
    let y = 0;
    if(state==0){
        x++;
    }
    else if(state==1){
        y++;
    }
    else if(state==2){
        x--;
    }
    else if(state==3){
        y--;
    }

    let first = body[0];
    let xi=(first[0]+x) %N;
    if(xi<0)
        xi=N-1;
    let yi=(first[1]+y)%N;
    if(yi<0)
        yi=N-1;
    let arr = [ xi , yi ];
    body.splice(0,0, arr);

    if(!increase)
    body.pop();
    checkDead();
}

interval = setInterval(update,speed);