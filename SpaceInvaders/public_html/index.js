/*
*Shiv Desai
*June 3, 2023
*Space Invaders game in JavaScript using Object Oriented Programming
*Inspiration: https://www.youtube.com/watch?v=MCVU0w73uKI
*/

const canvas = document.querySelector("canvas"); //get reference to canvas in html file
const scoreEl = document.querySelector("#scoreEl");//get reference to p tag that stores current score 
const died = document.querySelector("#end"); //get reference that holds the "game over" text
const c = canvas.getContext("2d");//allows drawing on canvas


//make canvas a fixed size by setting width and height
canvas.width = 1024;
canvas.height = 576;


//create class (object) for player
class Player {
    //create a constructor in which properties will be passed through
    constructor() {
        this.velocity = { //set x and y velocity of to 0
            x: 0,
            y: 0
        };
        
        //set rotation amount to 0
        this.rotation = 0;
        
        //set opacity to 1;
        this.opacity = 1;
        
        //create image for player
        const image = new Image();
        //set image source to correct file path
        image.src = "./spaceship.png";
        
        //load image onto canvas
        image.onload = () => {
            //scale down image to perfect size
            const scale = 0.15;
            //set image property to image variable
            this.image = image;
            //set perfect width and height by scaling 
            this.width = image.width * scale;
            this.height = image.height * scale;
            
            //create class variable of position
            this.position = {
                //set x and y position so image is perfectly in the bottom-middle
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            };
        };
    }
    
    //create draw function to put image on 
    draw() {
        //c.fillStyle = "red";
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.save();
        //set opacity of image to given opacity
        c.globalAlpha = this.opacity;
        //rotate player image by rotation amount ( in radians)
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
        c.rotate(this.rotation);
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
        //draw image if it is declared
        if (this.image) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        c.restore();
    }
    //create update function to update image if it is being moved
    update() {
        //if image is declared, move the image by the provided velocity
        if (this.image) {
            this.position.x += this.velocity.x;
            this.draw();//draw the image onto screen
        }
    }

}

//create a class for projectiles that user and aliens will be shooting
class Projectile {
    //create constructor in which class variables will be declared
    constructor( {position, velocity}){// position and velocity are variables that will be passed through when creating an instance of this class
        
        //set position and velocity of the object to the given ones
        this.position = position;
        this.velocity = velocity;
        //set radius of each projectile to 4
        this.radius = 4;
    }
    
    //create draw function to draw the projectile
    draw() {
        //draw a full red circle on canvas
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }
    //create update function to update each projectile on the screen
    update() {
        //draw projectiles and update their position using the velocity
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//create particle class which will be used for the death of user and aliens
class Particle {
    //create constructor in which class variables will be declared
    constructor( {position, velocity, radius, color, fades}){//have variables passed through when making an instance of this class. 
        
        //set positio, velocity, radius, color, and wheter or not the particles should fade to given variables
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.fades = fades;
        
        //set opacity of particles to 1
        this.opacity = 1;
    }
    //create draw function to draw particles on screen
    draw() {
        //create circles for each particle
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }
    //create update function to update the particles
    update() {
        //draw and update position of particles
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        //if particles should fade, decrease opacity slowly so they disappear
        if (this.fades){
            this.opacity -= 0.01;
        }
    }
}


class InvaderProjectile {
    constructor( {position, velocity}){
        this.position = position;
        this.velocity = velocity;

        this.width = 3;
        this.height = 10;
    }

    draw() {
        c.fillStyle = "white";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

//create class for "invaders" or aliens that user will shoot
class Invader {
    //create constructor that takes the position of each invader
    constructor( {position}) {
        //set velocity of each invader to 0 for both x and y
        this.velocity = {
            x: 0,
            y: 0
        };

        //create and load image of invaders
        const image = new Image();
        image.src = "./invader.png";
        //when the image loads...
        image.onload = () => {
            //scale image
            const scale = 1;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            //set position to given x and y positioning
            this.position = {
                x: position.x,
                y: position.y
            };
        };
    }
    
    //create draw function to draw invaders on canvas
    draw() {
        //if invader image exsists, draw onto canvas
        if (this.image) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }
    //update the images of the invaders, this takes velocity so we know the rate at which the invaders move
    update( {velocity}) {
        //if image is declared, change positioning by velocity and draw
        if (this.image) {
            this.position.x += velocity.x;
            this.position.y += velocity.y;
            this.draw();
    }
    }
    
    //create shoot function that takes an array of invader projectiles
    shoot(invaderProjectiles) {
        //add a new instance of an InvaderProjectile to the array
        invaderProjectiles.push(new InvaderProjectile({
            //set position of projectile using the given positioning
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            //set velocity of projectile so that it moves vertically
            velocity: {
                x: 0,
                y: 5
            }
        }));
    }
}


//create a class for each grid of invaders that will be displayed on the screen
class Grid {
    //create constructor that will contain class variables
    constructor() {
        //set x and y position to 0
        this.position = {
            x: 0,
            y: 0
        };
        //set velocity so the grid only moves horizontal
        this.velocity = {
            x: 3,
            y: 0
        };
        //create array with invaders that are in the grid
        this.invaders = [];
        
        //create a random number of columns and rows that will be in the grid
        const cols = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);
        
        //generate width of grid by multiplying number of cols by width of each image
        this.width = cols * 30;
        
        //nested for loop to loop through number of rows and cols (so an invader can be drawn at each spot)
        for (let x = 0; x < cols; x++) { //loop through num of cols
            for (let y = 0; y < rows; y++) { //loop through num of rows
                //add an instance of an invader to array at given position
                this.invaders.push(new Invader({position: {
                        x: x * 30,//*30 to create gap between each invader
                        y: y * 30//*30 to create gap between each invader
                    }}));
            }
        }
    }
    //create update function to update the grid of invaders
    update() {
        //change positioning by given x and y velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        //y velocity should be set to 0 as the grid will move across screen
        this.velocity.y = 0;

        //if the grid hits either end of the screen. make it move to opposite side and change y-velocity so it moves vertically for one frame and comes closer to player
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

//create instance of player class
const player = new Player();

//create necessary arrays that will store the different things that will be drawn onto the screen
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

//tracks if keys are pressed
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
};

//tracks amount of frames occured which will be used for randomization
let frames = 0;

//create random interval between each grid of invaders that will spawn
let randomInterval = Math.floor((Math.random() * 500) + 500);

//create an object that will track if the over is active or over
let game = {
    over: false,
    active: true
}
//creat variable to track score
let score = 0;

//create 100 particles for background effect of "star"
 for (let i = 0; i < 100; i++) {
        //add instance of a particle to the array that carries the particles that should be drawn on the screeny  
        particles.push(new Particle({
            //give necessary values for position, velocity, colour, and radius
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity: {
                x: 0,
                y: .3
            },
            radius: Math.random() * 2,
            color: "white"
        }));
}

//create a function that will push particles to array, takes three parameters of object type, colour, and fades
function createParticles( {object, color, fades}) {
    //creates 15 instances of the particle class
    for (let i = 0; i < 15; i++) {
        //adds each particles instance to array
        particles.push(new Particle({
            //give necessary values for position, velocity, colour, and radius and if the particles should fade or not
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || "#BAA0DE",
            fades: fades
        }));
}
}

//create function to animate game
function animate() {
    //check if game is active
    if (!game.active) {
        //display game over text and break out of function
        document.getElementById("end").innerHTML = "GAME OVER!";
        return;
    }
    //requests to make an animation repeatedly
    requestAnimationFrame(animate);
    
    //create black rectangle to cover entire canvas
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    //update player while the code runs
    player.update();
    //loop through each instance of particles in the array
    particles.forEach((particle, index) => {
        //check if particle has reached the end of the canvas/screen
        if (particle.position.y - particle.radius >= canvas.height){
            //randomize position and move particles back to top of screen to create an infinite star background 
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = -particle.radius;
        }
        
        //check if opacity of a particle is 0. this means that it has completly disappeared of the screen and should be removed from the array
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(index, 1);
            }, 0);
        } else { //continue updating the display of the particle
            particle.update();
        }

    });
    //loop through invaderProjectile array
    invaderProjectiles.forEach((invaderProjectile, index) => {
        //check if projectile is off the screen
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                //get rid of the instance of the projectile from the array
                invaderProjectiles.splice(index, 1);
            }, 0);
        } else { //keep displaying the invader projectile and update position
            invaderProjectile.update();
        }
        //check if invader projectiles has made contact with player
        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y
                && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width) {
            
            //player is dead, create particle effect of color white and make sure particles fade away
            createParticles({
                object: player,
                color: "white",
                fades: true
            });
            
            //get rid of invader projectile that hit player and set player opacity to 0 so the image doesn't show on screen, make sure game over is true so we can use it later on
            setTimeout(() => {
                invaderProjectiles.splice(index, 1);
                player.opacity = 0;
                game.over = true;
            }, 0);
            
            //game isn't active, wait 2 seconds till game pauses
            setTimeout(() => {
                game.active = false;
            }, 2000);
        }

    });

    //loop through each projectile in array
    projectiles.forEach((projectile, index) => {
        //check if projectile is off the screen
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                //remove it from array
                projectiles.splice(index, 1);
            }, 0);
        } else {//keep updating position of the projectile
            projectile.update();
        }
    });
    //loop through every grid in the array
    grids.forEach((grid, gridIndex) => {
        //update grid positioning 
        grid.update();
        
        //shoot an invader projectile every 100 frames, and if there are even invaders in the grid
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
        }
        
        //loop through every invader in a grid
        grid.invaders.forEach((invader, i) => {
            
            //update positioning of every invader in the grid by the grid's given velocity
            invader.update({velocity: grid.velocity});
            //loop through every projectile shoot by the spaceshup
            projectiles.forEach((projectile, j) => {
                //check if the projectile has hit an invader
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height
                        && projectile.position.x + projectile.radius >= invader.position.x
                        && projectile.position.x - projectile.radius <= invader.position.x + invader.width
                        && projectile.position.y + projectile.radius >= invader.position.y) {

                    setTimeout(() => {
                        //check if there is an invader in the grid by checking the array
                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader
                        );
                        //check if there even is a projectile on the screen by checking the array
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile
                        );
                        //if both are found
                        if (invaderFound && projectileFound) {
                            //projectile has hit an invader, increment score
                            score += 100;
                            //change score text
                            scoreEl.innerHTML = score;
                            //create particle effect due to invader's death, make sure particles fade
                            createParticles({
                                object: invader,
                                fades: true
                            });
                            //get rid of invader and projectile off screen
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);
                            //check if there are invaders in a grid
                            if (grid.invaders.length > 0) {
                                //get position of first and last invader in grid
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];
                                //change grid size according the current invaders that are still alive so when the grid moves it still changes direction when it hits the end of the screen
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            } else {
                                //get rid of a grid as there are no more invaders in that grid
                                grids.splice(gridIndex, 1);
                            }
                        }
                    }, 0);
                }
            });
        });
    });
    //check if user has pressed the key "a" and isn't already at the very left of the screen 
    if (keys.a.pressed && player.position.x >= 0) {
        //move player to left and rotate it left ever so slightly
        player.velocity.x = -5;
        player.rotation = -.15;
    //check if user has pressed the key "d" and isn't already at the very right of the screen 
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        //move player to left and rotate it right ever so slightly
        player.velocity.x = 5;
        player.rotation = .15;
    } else { //player isn't pressing any key that is meant to move the spaceship, keep spaceship stationary
        player.velocity.x = 0;
        player.rotation = 0;
    }
    //if frame rate is divisible by the randomInterval between grid
    if (frames % randomInterval === 0) {
        //add a new grid to the array of grids, create a new random interval and reset frame amount
        grids.push(new Grid());
        randomInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }
    //increment frames each time animate function is ran
    frames++;
}

//call animate function
animate();

//check if a key is pressed
addEventListener("keydown", ({key}) => {
    if (game.over) return; //if game is over, don't do anything
    
    //check for key type
    switch (key) {
        //if a is pressed, change boolean to true so player can move
        case "a":
            keys.a.pressed = true;
            //break so we don't infinitely do this
            break;
        //if d is pressed, change boolean to true so player can move
        case "d":
            keys.d.pressed = true;
            //break so we don't infinitely do this
            break;
        //if space is pressed then user wants to shoot a projectile
        case " ":
            //add a new instance of a projectile to the array of projectiles
            projectiles.push(new Projectile({
                //give necessary position and velocity of projectile
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }));
            //break so we don't infinitely do this
            break;
}
});


//check if key is let go
addEventListener("keyup", ({key}) => {
    //check for key type
    switch (key) {
        //if a is lifted, make sure boolean is false so player stops moving, make sure to break so we don't do this infinitely
        case "a":
            keys.a.pressed = false;
            break;
        //if d is lifted, make sure boolean is false so player stops moving, make sure to break so we don't do this infinitely
        case "d":
            keys.d.pressed = false;
            break;
        //if space is lifted, don't do anything, just break so we don't go infinitely
        case " ":
            break;
}
});