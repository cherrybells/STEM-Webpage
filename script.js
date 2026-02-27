let move_speed = 3;
let gravity = 0.35;

let bird = document.querySelector('.hironobird');
let img = document.getElementById('bird');

let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let bird_dy = 0;

img.style.display = 'none';
message.classList.add('messageStyle');

/* ---------- START GAME ---------- */

function startGame() {

    if (game_state === 'Play') return;

    game_state = 'Play';
    bird_dy = 0;

    document.querySelectorAll('.pipe_sprite').forEach(el => el.remove());

    bird.style.top = '40vh';
    img.style.display = 'block';

    score_val.innerHTML = '0';
    score_title.innerHTML = 'Score : ';
    message.innerHTML = '';
    message.classList.remove('messageStyle');

    play();
}

function jump() {
    if (game_state === 'Play') {
        bird_dy = -7;
    }
}

/* -------- UNIVERSAL CONTROLS -------- */

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') startGame();
    if (e.key === 'ArrowUp') jump();
});

document.addEventListener('click', () => {
    if (game_state !== 'Play') startGame();
    else jump();
});

document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (game_state !== 'Play') startGame();
    else jump();
}, { passive: false });


/* ---------- GAME LOOP ---------- */

function play() {

    let pipe_gap = window.innerWidth < 768 ? 35 : 30;
    let pipe_separation = 0;

    function move() {

        if (game_state !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');

        pipe_sprite.forEach((element) => {

            let pipe_props = element.getBoundingClientRect();
            let bird_props = bird.getBoundingClientRect();

            if (pipe_props.right <= 0) {
                element.remove();
            }

            // COLLISION DETECTION
            else if (
                bird_props.left < pipe_props.left + pipe_props.width &&
                bird_props.left + bird_props.width > pipe_props.left &&
                bird_props.top < pipe_props.top + pipe_props.height &&
                bird_props.bottom > pipe_props.top
            ) {
                endGame();
                return;
            }

            // SCORE
            else if (
                pipe_props.right < bird_props.left &&
                element.increase_score === '1'
            ) {
                score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
                element.increase_score = '0';
            }

            element.style.left = pipe_props.left - move_speed + 'px';
        });

        requestAnimationFrame(move);
    }

    function apply_gravity() {

        if (game_state !== 'Play') return;

        bird_dy += gravity;

        let bird_props = bird.getBoundingClientRect();

        if (
            bird_props.top <= 0 ||
            bird_props.bottom >= background.bottom
        ) {
            endGame();
            return;
        }

        bird.style.top = bird_props.top + bird_dy + 'px';

        requestAnimationFrame(apply_gravity);
    }

    function create_pipe() {

        if (game_state !== 'Play') return;

        if (pipe_separation > 100) {

            pipe_separation = 0;

            let pipe_pos = Math.floor(Math.random() * 40) + 10;

            // TOP PIPE
            let pipe_top = document.createElement('div');
            pipe_top.className = 'pipe_sprite';
            pipe_top.style.top = pipe_pos - 70 + 'vh';
            document.body.appendChild(pipe_top);

            // BOTTOM PIPE
            let pipe_bottom = document.createElement('div');
            pipe_bottom.className = 'pipe_sprite';
            pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
            pipe_bottom.increase_score = '1';
            document.body.appendChild(pipe_bottom);
        }

        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }

    requestAnimationFrame(move);
    requestAnimationFrame(apply_gravity);
    requestAnimationFrame(create_pipe);
}

/* ---------- GAME OVER ---------- */

function endGame() {
    game_state = 'End';
    img.style.display = 'none';
    message.innerHTML =
        '<span style="color:red;">Game Over</span><br>Tap / Click / Press Enter to Restart';
    message.classList.add('messageStyle');
}