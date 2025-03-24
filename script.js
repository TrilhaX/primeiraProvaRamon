const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')
const gameOverDiv = document.querySelector('.gameOverDiv')
const t = Math.random() * canvas.height
const localSave = localStorage.setItem("MaxPontos", 0);

let gameRunning = true
let iniciandoGame = true
let pontosQ = 0
let maxpontosQ = 0

const cobraCorpo = []
const pontos = document.querySelector("#pontosQ")
const maxpontos = document.querySelector("#maxPontosQ")

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
        iniciandoGame = false
    }
});

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
        cobraCorpo.push({ x: this.x, y: this.y });
        if (cobraCorpo.length > 10) {
            cobraCorpo.shift();
        }
    }

    desenhar(cor) {
        ctx.fillStyle = cor;
        cobraCorpo.forEach((segment) => {
            ctx.fillRect(segment.x, segment.y, this.largura, this.altura);
        });
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
        pontosQ += 1
        pontos.innerHTML = "Pontos: " + pontosQ
        if (pontosQ > maxpontosQ){
            maxpontosQ = pontosQ
            maxpontos.innerHTML = "Max Pontos: " + maxpontosQ
            localStorage.setItem("MaxPontos", maxpontosQ);
        }
        cobraCorpo.push({ x: this.x, y: this.y });
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

    verificarColisaoConsigoMesma() {
        if (!iniciandoGame) {
            for (let i = 0; i < cobraCorpo.length; i++) {
                const segment = cobraCorpo[i];
                if (
                    this.x === segment.x &&
                    this.y === segment.y &&
                    i !== cobraCorpo.length - 1 
                ) {
                    this.#houveColisaoConsigoMesma();
                }
            }
        }
    }

    #houveColisaoConsigoMesma(){
        Game.gameOver()
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

class Game {
    static gameOver() {
        if (gameRunning == false) {
            gameRunning = false
            gameOverDiv.style.display = "flex"
            pontos.innerHTML = "Pontos: 0"
            iniciandoGame = true
        }
    }
    
    static reiniciar() {
        if (gameRunning == false) {
            document.addEventListener('keydown', (e) => {
                if (e.code === 'KeyR') {
                    gameOverDiv.style.display = "none" 
                    pontosQ = 0
                    cobra.x = 100
                    cobra.y = 200
                    for (let tecla in teclasPressionadas) {
                        teclasPressionadas[tecla] = false;
                    }
                    cobraCorpo.length = 0;
                    comida.x = Math.random() * canvas.width - 10
                    comida.y = t
                    gameRunning = true
                }
            });
        }
    }
}

function loop() {
    const maxpontosLocal = localStorage.getItem("MaxPontos");
    maxpontos.innerHTML = "Max Pontos: " + maxpontosLocal
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cobra.desenhar('Green')
    comida.desenhar('Red')
    if (gameRunning == true) {
        cobra.atualizar()
        cobra.verificarColisao(comida)
        cobra.verificarBorda()
        cobra.verificarColisaoConsigoMesma()
    }
    Game.reiniciar()
    requestAnimationFrame(loop)
}
loop()