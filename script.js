let themeMusic = new Audio('Energy Theme.mp3');

let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let point = new Audio('point.mp3');
let die = new Audio('die.mp3');

let bird_props = bird.getBoundingClientRect();
let bg = document.querySelector('.bg').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = "Start";
img.style.display = 'none';
message.classList.add('messageStyle');

// Play the theme music when the game starts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((pipe) => pipe.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score: ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle'); 
        play();
        
        themeMusic.play();
        themeMusic.loop = true;
    }
});

function play() {
    function move() {
        if (game_state !== 'Play') return;
        document.querySelectorAll('.pipe_sprite').forEach((pipe) => {
            let pipe_props = pipe.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_props.right <= 0) {
                pipe.remove();
            } else {
                if (
                    bird_props.left < pipe_props.left + pipe_props.width &&
                    bird_props.left + bird_props.width > pipe_props.left &&
                    bird_props.top < pipe_props.top + pipe_props.height &&
                    bird_props.top + bird_props.height > pipe_props.top
                ) {
                    gameOver();
                    return;
                } else if (pipe_props.right < bird_props.left && pipe.increase_score === '1') {
                    score_val.innerHTML = +score_val.innerHTML + 1;
                    pipe.increase_score = '0';
                    point.play();
                }
                pipe.style.left = pipe_props.left - move_speed + 'px';
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state !== 'Play') return;
        bird_dy += gravity;
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();

        if (bird_props.top <= 0 || bird_props.bottom >= bg.bottom) {
            gameOver();
            return;
        }
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'Bird-2.png';
            bird_dy = -7.6;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'Bird.png';
        }
    });

    let pipe_separation = 0;
    let pipe_gap = 35;
    function create_pipe() {
        if (pipe_separation > 115) {
            pipe_separation = 0;
            let pipe_position = Math.floor(Math.random() * 43) + 8;
            
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_position - 70 + 'vh';
            pipe_top.style.left = '100vw';
            document.body.appendChild(pipe_top);

            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_position + pipe_gap + 'vh';
            pipe_bottom.style.left = '100vw';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

function gameOver() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br> Press Enter To Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
    die.play();
    themeMusic.pause();
    themeMusic.currentTime = 0;
}
