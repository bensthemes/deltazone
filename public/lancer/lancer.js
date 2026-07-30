let canvas = document.querySelector('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

const img = new Image();
img.src = "lancer.png";
c.imageSmoothingEnabled = false;
const add = document.getElementById('add')
const reset = document.getElementById('reset')

const audio = new Audio('https://file.garden/acoeqRVugnRof4eN/lancer-splat.mp3');
audio.volume = 0.3;
const friendLaugh = new Audio('https://file.garden/acoeqRVugnRof4eN/imagefriend.mp3')
audio.volume = 0.5;

let fun = Number(localStorage.getItem('funvalue')) || Math.floor(Math.random() * 100) + 1;
console.log(fun);
localStorage.setItem("funvalue", fun);
console.log(localStorage.getItem("funvalue"))

const lancerAmount = document.getElementById('lancer-amount');

const friend = 0.1; 
const image_friend = new Image()


//initial lancer.
let x = Math.random() * (innerWidth - 25) + 50;
let y = Math.random() * (innerHeight - 25) + 50;
let dx = (Math.random() - 0.5) * 5;
let dy = (Math.random() - 0.5) * 3.5;

let lancers = [];
lancers.push(new Lancer(x, y, dx, dy));


//lancer object
function Lancer(x, y) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.draw = function() {
        c.drawImage(img, this.x, this.y, 50, 50);
    }

    this.update = function() {
        if(this.x > innerWidth - 50 || this.x < 0 ) {
            this.dx = -this.dx;
        }
        if (this.y > innerHeight - 50 || this.y < 0 ) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

//add lancer function
function addLancer() {
    x = Math.random() * (innerWidth - 100) + 50;
    y = Math.random() * (innerHeight - 100) + 50;
    dx = (Math.random() - 0.5) * 5;
    dy = (Math.random() - 0.5) * 3.5;
    
    lancers.push(new Lancer(x, y, dx, dy));
    console.log("NEW LANCER ADDED");
}

function resetLancer() {
    img.src = "lancer.png"
    x = Math.random() * (innerWidth - 100) + 50;
    y = Math.random() * (innerHeight - 100) + 50;
    dx = (Math.random() - 0.5) * 5;
    dy = (Math.random() - 0.5) * 3.5;
    lancers.length = 0;
    console.log(lancers);
    lancers.push(new Lancer(x, y, dx, dy));
    add.disabled = false;
}

function smile() {
    img.src = "IMAGE_FRIEND.png";
    friendLaugh.play();
    setTimeout(resetLancer, 5000);
    lancers.length = 1;
    console.log("smile")
    add.disabled = true;
}


add.addEventListener("click", () => {
    if (Math.random() < (friend / 100)) {
        smile();
    } else {
        addLancer();
        lancerAmount.textContent = lancers.length;
    }
});

//it doesnt work lol 
function playLancerSplat() {
    const audioClone = audio.cloneNode(true);
    audioClone.play();

    audioClone.addEventListener('ended', () => {
        audioClone.remove();
    });
}


//reset the lancers.
reset.addEventListener("click", () => {
    resetLancer();
    lancerAmount.textContent = lancers.length;
    console.log("LANCERS REMOVED")
})

//display lancers currently onscreen
lancerAmount.textContent = lancers.length;


//animation loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    
    for(let i = 0; i < lancers.length; i++) {
        lancers[i].update();
    }
}
animate();


//fun events. LATER
if(fun == 66) {

}
