//GAME VARIABLES AND CONSTANTS
let inputDir = { x:0, y:0}
const moveSound = new Audio('move.mp3')
const gameMusic = new Audio('music.mp3')
const gameOverSound = new Audio('gameover.mp3')
const foodSound = new Audio('food.mp3')
speed = 5
let lastPaintTime = 0; //last time jab screen paint hui thi 
let snakeArr = [
    {x:13, y:15} //coordinates 
]
let food = {x:2, y:3};
let score = 0;
let congrats = document.querySelector(".congrats");




//GAME FUNCTIONS
function main(current_time){
    window.requestAnimationFrame(main); //yaha se loop generate hoga 
    // console.log(current_time) 
    // The requestAnimationFrame(main) call inside the main function ensures that the main function keeps being invoked before each new frame. As a result:
    // The browser continuously queues main for the next frame, creating an infinite loop.

    if((current_time - lastPaintTime)/1000 < 1/speed){
        return; //nahi chahiye muje ye render 
    }
    lastPaintTime = current_time; 
    //ye sab fps kam krne ke liye kar rahe 
    gameEngine(); 
}

function isCollide(snakeArr){
    for (let i = 1; i < snakeArr.length-1; i++) {
        if(snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y){
            return true;
        }
    }

    if((snakeArr[0].x >=18 || snakeArr[0].x <=0) || (snakeArr[0].y >=18 || snakeArr[0].y <=0)){
        return true;
    }
}

function gameEngine(){
    //part1: updating the snake and food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        gameMusic.pause();
        inputDir = { x:0, y:0};
        alert('Game over. Press any key to play again!')
        snakeArr = [{x:13, y:15}]
        gameMusic.play();
        score = 0;
        congrats.innerHTML = "";

        }

    //if you have eaten the food, increment the score and regenerate the food
    //let congrats = document.querySelector(".congrats");
        if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
            foodSound.play();
            score += 1;
            if(score > highest_score_value){
                congrats.innerHTML = "Congratulations!!! you created a highest score";
                highest_score_value = score;
                localStorage.setItem(highest_score, JSON.stringify(highest_score_value))
                highestScoreBox.innerHTML = "Highest Score: " + highest_score_value
            }
            let scoreBox = document.querySelector(".score");
            scoreBox.innerHTML = "Score:" + score;
            //condition ye hai ki if snake ka head is equal to food 
            snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
            //snake ke aage ki ek aur mundi add krdi 
            //updating the location of the food
            let a =2;
            let b =16;
            food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())}
            //math.round nearent integer m round off krta h 

        }

    //Moving the snake (har ek segment ko aage khiska deknge)
        for (let i = snakeArr.length -2; i>=0 ; i--) {
            // snakeArr[i+1] = snakeArr[i]; esa nahi kr skte vrna sab ek hi ko point krenge isliye destructuring krna pdega 
            snakeArr[i+1] = {...snakeArr[i]} //ye ek object hoga
            //basically sbko ek aage shift kiya hai 
        }

        snakeArr[0].x += inputDir.x; 
        snakeArr[0].y += inputDir.y; //head ko ek aage shift kiya h

    //part2: render(display) the snake and food
    //Display the snake
    let board = document.querySelector(".board");
    board.innerHTML = ""; //taki multiple snakes create na ho 
    snakeArr.forEach((e, index) =>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index === 0){
            snakeElement.classList.add('head')
        }
        else{
            snakeElement.classList.add('snake')
        }
        board.appendChild(snakeElement)
    })

    //Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement)

}





//MAIN GAME LOGIC
let highest_score = localStorage.getItem("highest_score") //ye check krega kya browser ke locak storage m highest_score hi
let highestScoreBox = document.querySelector(".highestscore")
if(highest_score === null){
    highest_score_value = 0;
    localStorage.setItem(highest_score, JSON.stringify(highest_score_value))
}
else{
    highest_score_value = JSON.parse(highest_score)
    highestScoreBox.innerHTML = "Highest Score: " + highest_score
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x:0, y:1}; //start the game, mtlb neeche move krega 
    // The CSS Grid system starts indexing from 1 (not 0) for rows. 
    moveSound.play();
    //detect the key 
    switch (e.key) {
        case "ArrowUp":
            console.log('ArrowUp');
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            console.log('ArrowDown');
            inputDir.x = 0; 
            inputDir.y = 1;
            break;
            // Moving down (y: 1): When the ArrowDown key is pressed, the code sets inputDir = { x: 0, y: 1 }, meaning the snake will move one step down in the grid every time the game engine runs. This increases the y-coordinate.
        case "ArrowRight":
            console.log('ArrowRight');
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case "ArrowLeft":
            console.log('ArrowLeft');
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
})

//i have added this to github 