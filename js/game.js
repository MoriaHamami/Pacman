'use strict'

const WALL = '🧱'
const FOOD = '.'
const EMPTY = ' '
const POWER_FOOD = '🍰'
const CHERRY = '🍒'

const gGame = {
    score: 0,
    isOn: false,
    foodCount: -1
}

var gBoard
var gIntervalCherries
var gIsVictorious

function onInit() {
    restartVars()
    gBoard = buildBoard()
    createGhosts(gBoard)
    createCherries(gBoard)
    renderBoard(gBoard, '.board-container')
    createPacman(gBoard)
    gGame.isOn = true
}

function restartVars() {
    gIsVictorious = false
    gWasOnPowerFood = false
    gGame.foodCount = -1
    gGame.score = 0
    updateScore(0)
    showElement('.board-container')
    hideElement('h1')
    hideElement('button')
    hideElement('.victorious')
    gGhosts = []
    gDeadGhosts = []
}

function createCherries(board) {
    gIntervalCherries = setInterval(() => {
        const emptyCell = getEmptyRandCell()
        //If empty cell found put a cherry
        if (emptyCell !== -1) {
            // Update Model
            board[emptyCell.i][emptyCell.j] = CHERRY
            // Update DOM
            renderCell(emptyCell, CHERRY)
        }
    }, 15000)
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gGame.foodCount++
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gGame.foodCount--
            }
            if ((i === 1 && j === 1) ||
                (i === size - 2 && j === size - 2) ||
                (i === 1 && j === size - 2) ||
                (i === size - 2 && j === 1)) {
                board[i][j] = POWER_FOOD
                gGame.foodCount--
            }
        }
    }
    return board
}

function updateScore(diff) {
    // Model
    gGame.score += diff
    // DOM
    document.querySelector('h2 span').innerText = gGame.score

}

function gameOver() {
    clearInterval(gIntervalGhosts)
    clearInterval(gIntervalCherries)
    gGame.isOn = false

    if (gIsVictorious) {
        var timeoutId = setTimeout(() => {
            hideElement('.board-container')
            showElement('.victorious')
            showElement('button')
            clearTimeout(timeoutId)
        }, 2000)
    } else {
        renderCell(gPacman.location, '🪦')
        var timeoutId = setTimeout(() => {
            showElement('h1')
            showElement('button')
            hideElement('.board-container')
            clearTimeout(timeoutId)
        }, 2000)
    }

}

