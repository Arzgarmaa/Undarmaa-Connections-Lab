// STEP 1
// Declare variables for our ball objects
// let ball;
// let ball2;

// create an array to store objects
let bucketOfBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight-windowHeight/3
  );

  // STEP 2
  //  Instantiate the ball objects one at a time
  // ball = new Ball();
  // console.log(ball);

  // ball2 = new Ball();
  // console.log(ball2);

  // instead, use a loop to make many ball objects
 for (let i = 0; i < 100; i++) {
   let newBall = new Ball();
   bucketOfBalls.push(newBall)
 }
  console.log(bucketOfBalls)
}

function draw() {
  background(220);

  // STEP 3
  // Draw and animate the objects
  // ball.display();
  // ball.move();
  // ball.bounce();

  // ball2.display();
  // ball2.move();
  // ball2.bounce();

// UPDATE NOW THAT WE HAVE AN ARRAY
  // count through the array items to display an animate objects
  for (let i = 0; i < bucketOfBalls.length; i++) {
    bucketOfBalls[i].display()
    bucketOfBalls[i].move()
    bucketOfBalls[i].bounce()
  }

  console.log(mouseX, mouseY)
  
}

// STEP 0
// Write a class for a template to make ball objects
class Ball {
  // properties
  constructor() {
    
    this.size = random(10,50);
    this.x = random(0 + this.size/2, width - this.size/2);
    this.y = random(0 + this.size/2, height - this.size/2);
    this.xspeed = random(1, 5);
    this.yspeed = random(1, 5);
    this.color1 = random (200, 255)
    this.color2 = random (0, 10)
    this.color3 = random (100, 255)
  }

  // behaviors
  display() {
    fill(this.color1, this.color2, this.color3)
    circle(this.x, this.y, this.size);
    
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  bounce() {
    if (this.x > width - this.size/2 || this.x < 0 + this.size/2) {
      this.xspeed *= -1;
    }
    if (this.y > height - this.size/2 || this.y < 0 + this.size/2 ) {
      this.yspeed *= -1;
    }
    
  }
}
