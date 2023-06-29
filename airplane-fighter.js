let maxRandomXInterval = 550
let minRandomXInterval = 50

let maxRandomRadiusInterval = 60
let minRandomRadiusInterval = 20

class obstacles {
    constructor() {
        let randomX = Math.floor(Math.random() * (maxRandomXInterval - minRandomXInterval + 1) + minRandomXInterval)
        let randomRadius = Math.floor(Math.random() * (maxRandomRadiusInterval - minRandomRadiusInterval + 1) + minRandomRadiusInterval)
        this.x = randomX
        this.y = 20
        this.vy = 5
        this.radius = randomRadius
        this.color = "pink"
    }
    draw() {
        let canvas = document.getElementById("canvas")
        let ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

let obstaclesArray = new Array(50)

function arrayOfObstacles(multiplySpeed) {
    for (let i = 0; i < obstaclesArray.length; ++i) {
        obstaclesArray[i] = new obstacles()
        obstaclesArray[i].vy = obstaclesArray[i].vy + 3 * multiplySpeed
    }
}

let numberOfObstacles = 1
let yDistance = 150
let raf

function gameAnimation() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "white"
    ctx.font = "30px serif"
    ctx.fillText("score:" + score, 500, 20)
    for (let i = 0; i < numberOfObstacles; ++i) {
        obstaclesArray[i].draw()
        obstaclesArray[i].y += obstaclesArray[i].vy
        crash(i)
        if (obstaclesArray[numberOfObstacles - 1].y > yDistance && numberOfObstacles != obstaclesArray.length - 1) {
            ++numberOfObstacles
        }
        if (obstaclesArray[obstaclesArray.length - 2].y > canvas.height) {
            numberOfObstacles = 1
            reset()
            return
        }
    }
    if (hitObject) {
        endGameMenu()
        return
    }
    moveTheAirplane()
    raf = window.requestAnimationFrame(gameAnimation)
}

let multiplySpeed = 0

function reset() {
    ++multiplySpeed
    window.cancelAnimationFrame(raf)
    arrayOfObstacles(multiplySpeed)
    requestAnimationFrame(gameAnimation)
    return
}

function startTheGame(event) {
    let elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop
    if (x >= startRestartBoxX && x <= startRestartBoxX + startRestartBoxWidth && y >= startRestartBoxY && y <= startRestartBoxY + startRestartBoxHeight) {
        arrayOfObstacles(multiplySpeed)
        window.cancelAnimationFrame(raf)
        gameAnimation()
        clearTheScore = setInterval(showPlayerScore, 1000)
        canvas.removeEventListener("click", startTheGame, true)
    }
}

class airplane {
    constructor() {
        this.x = 300
        this.y = 500
        this.vx = 5
        this.width = 56
        this.height = 56
        this.midle = 28
    }
    drawTheAirplane() {
        let canvas = document.getElementById("canvas")
        let ctx = canvas.getContext("2d")
        let img = new Image()
        img.src = "https://cdn-icons-png.flaticon.com/512/1223/1223325.png"
        ctx.drawImage(img, this.x, this.y, this.width, this.height)
    }
}

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
let rightPressed = false
let leftPressed = false

function keyDownHandler(event) {
    if (event.keyCode === 39) {
        rightPressed = true
    } else if (event.keyCode === 37) {
        leftPressed = true
    }
}

function keyUpHandler(event) {
    if (event.keyCode === 39) {
        rightPressed = false
    } else if (event.keyCode === 37) {
        leftPressed = false
    }
}

let airplanePlayer = new airplane()
let fifty = 50

function moveTheAirplane() {
    airplanePlayer.drawTheAirplane()
    if (rightPressed) {
        airplanePlayer.x += airplanePlayer.vx
        if (airplanePlayer.x > canvas.height - fifty) {
            airplanePlayer.x -= airplanePlayer.vx
        }
    } else if (leftPressed) {
        airplanePlayer.x  -= airplanePlayer.vx
        if (airplanePlayer.x < 0) {
            airplanePlayer.x += airplanePlayer.vx
        }
    }
}

let hitObject = false

function crash(i) {
    let xCoordinates = ((airplanePlayer.x + airplanePlayer.midle) - obstaclesArray[i].x) 
    let yCoordinates = ((airplanePlayer.y + airplanePlayer.midle) - obstaclesArray[i].y)
    let distanceBetweenObjects = Math.sqrt( xCoordinates*xCoordinates + yCoordinates*yCoordinates )
    if (distanceBetweenObjects < airplanePlayer.midle + obstaclesArray[i].radius) {
        hitObject = true
    }
}

let score = 0
let clearTheScore

function showPlayerScore() {
    ++score
}

let menuBoxX = 100
let menuBoxY = 150
let menuBoxWidth = 350
let menuBoxHeight = 250

let startRestartBoxX = 180
let startRestartBoxY = 300
let startRestartBoxWidth = 150
let startRestartBoxHeight = 60

let startRestartX = 200
let startRestartY = 350

function startMenu() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(menuBoxX, menuBoxY, menuBoxWidth, menuBoxHeight)
    ctx.fillStyle = "black"
    ctx.font = "25px serif"
    ctx.fillText("How to play:", 190, 170)
    ctx.fillStyle = "blue"
    ctx.fillText("Press: < > to move the plane", 140, 220)
    ctx.fillStyle = "red"
    ctx.fillRect(startRestartBoxX, startRestartBoxY, startRestartBoxWidth, startRestartBoxHeight)
    ctx.fillStyle = "black"
    ctx.font = "60px serif"
    ctx.fillText("Start", startRestartX, startRestartY)
    canvas.addEventListener("click", startTheGame, true)
}

function endGameMenu() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(menuBoxX, menuBoxY, menuBoxWidth, menuBoxHeight)
    ctx.fillStyle = "green"
    ctx.font = "35px serif"
    ctx.fillText("Your score:" + score, 170, 220)
    ctx.fillStyle = "green"
    ctx.fillRect(startRestartBoxX, startRestartBoxY, startRestartBoxWidth, startRestartBoxHeight)
    ctx.fillStyle = "black"
    ctx.font = "40px serif"
    ctx.fillText("Restart", startRestartX, startRestartY)
    canvas.addEventListener("click", restartTheGame, true)
}

function restartTheGame(event) {
    let elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop
    if (x >= startRestartBoxX && x <= startRestartBoxX + startRestartBoxWidth && y >= startRestartBoxY && y <= startRestartBoxY + startRestartBoxHeight) {
        score = 0
        clearInterval(clearTheScore)
        clearTheScore = null
        hitObject = false
        rightPressed = false
        leftPressed = false
        numberOfObstacles = 1
        multiplySpeed = 0
        airplanePlayer = new airplane()
        arrayOfObstacles(multiplySpeed)
        window.cancelAnimationFrame(raf)
        gameAnimation()
        clearTheScore = setInterval(showPlayerScore, 1000)
        canvas.removeEventListener("click", restartTheGame, true)
    }
}

window.onload = startMenu













