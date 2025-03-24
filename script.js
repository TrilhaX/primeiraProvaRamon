const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')
const gameOverDiv = document.querySelector('.gameOverDiv')
const t = Math.random() * canvas.height
let gameRunning = true

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(e.code)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Game {
    static gameOver() {
        if (gameRunning == false) {
            gameOverDiv.style.display = "flex"
        }
    }

    static reiniciar() {
        if (gameRunning == false) {
            document.addEventListener('keydown', (e) => {
                if (e.code === 'R') {
                    if (gameRunning == false) {
                        gameOverDiv.style.display = "flex"
                    }
                }
            });
        }
    }
}

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura
    }
    desenhar(cor) {
        ctx.fillStyle = cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}


class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura)
    }
    atualizar() {
        if (teclasPressionadas.KeyW) {
            this.y -= 7
        } else if (teclasPressionadas.KeyS) {
            this.y += 7
        } else if (teclasPressionadas.KeyA) {
            this.x -= 7
        } else if (teclasPressionadas.KeyD) {
            this.x += 7
        }
    }
    verificarColisao(comida) {
        if (
            this.x < comida.x + comida.largura &&
            this.x + this.largura > comida.x &&
            this.y < comida.y + comida.altura &&
            this.y + this.altura > comida.y
        ) {
            this.#houveColisao(comida)
        }
    }
    #houveColisao(comida) {
        comida.x = Math.random() * canvas.width - 10
        comida.y = Math.random() * canvas.height - 10
    }

    verificarBorda() {
        if (
            this.x < 0 ||
            this.x + this.largura > canvas.width ||
            this.y < 0 ||
            this.y + this.altura > canvas.height
        ) {
            gameRunning = false;
            Game.gameOver()
        }
    }
}
class Comida extends Entidade {
    constructor() {
        super(Math.random() * canvas.width - 10, t - 10, 20, 20)
    }
}
// o T foi declarado la em cima professor

const cobra = new Cobra(100, 200, 20, 20)
const comida = new Comida()

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cobra.desenhar('Green')
    comida.desenhar('Red')
    if (gameRunning == true) {
        cobra.desenhar('Green')
        cobra.atualizar()
        comida.desenhar('Red')
        cobra.verificarColisao(comida)
        cobra.verificarBorda()
        requestAnimationFrame(loop)
    }
}
loop()