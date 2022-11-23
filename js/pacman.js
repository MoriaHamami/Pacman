'use strict'

const PACMAN = '🦸'
const PACMAN_IMG = '<img src="img/pacman.jpg">'

var gPacman
var gWasOnPowerFood
var gDeadGhosts

function createPacman(board) {
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false, 
        deg: '90'
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
    renderCell(gPacman.location, PACMAN_IMG)
}

function movePacman(ev) {
    console.log('foodCount:', gGame.foodCount)
    if (!gGame.isOn) return
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return

    // checkIfOnGhost(nextCell, nextLocation)
    if (nextCell === GHOST) {
        if (gPacman.isSuper) { 
            killGhost(nextLocation)
        } else {
            gameOver()
            return
        }
    }

    updateScores(nextCell)

    changeLocation(nextLocation)

    // Keep power food when player is super
    if (nextCell === POWER_FOOD && gPacman.isSuper) gWasOnPowerFood = true

    checkIfOnPowerFood(nextCell)

}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard) {
        case 'ArrowUp':
            gPacman.deg = '-90'
            nextLocation.i--
            break;
        case 'ArrowRight':
            gPacman.deg = '0'
            nextLocation.j++
            break;
        case 'ArrowDown':
            gPacman.deg = '90'
            nextLocation.i++
            break;
        case 'ArrowLeft':
            gPacman.deg = '180'
            nextLocation.j--
            break;
    }
    return nextLocation
}

function getPacmanHTML(deg) {
    return `<div class="pacman" style="transform: rotate(${deg}deg)">${PACMAN_IMG}</div>`
}

function killGhost(nextLocation) {
    const ghostIdxToRemove = getGhostIdxByLocation(nextLocation.i, nextLocation.j)
    const currGhost = gGhosts[ghostIdxToRemove]
    //Update Model
    gDeadGhosts.push(currGhost)
    gGhosts.splice(ghostIdxToRemove, 1)
    //Update DOM 
    renderCell(currGhost.location, currGhost.currCellContent)
    if (currGhost.currCellContent === FOOD) {
        currGhost.currCellContent = EMPTY
        gGame.foodCount--
        if(gGame.foodCount === 0) {
            gIsVictorious=true
            gameOver()
        }
    }
}

function updateScores(thisCell) {
    if (thisCell === FOOD) {
        updateScore(1)
        gGame.foodCount--
        if (gGame.foodCount === 0) {
            gIsVictorious = true
            gameOver()
        }
    }
    if (thisCell === CHERRY) {
        updateScore(10)
    }
}

function changeLocation(nextLocation) {
    // moving from current location:
    if (gWasOnPowerFood) {
        // Model
        gBoard[gPacman.location.i][gPacman.location.j] = POWER_FOOD
        // DOM
        renderCell(gPacman.location, POWER_FOOD)
        gWasOnPowerFood = false
    } else {
        // Model
        gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
        // DOM
        renderCell(gPacman.location, EMPTY)
    }

    // Move the pacman to new location:
    // Model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    // DOM
    renderCell(nextLocation, getPacmanHTML(gPacman.deg))
}

function checkIfOnPowerFood(thisCell) {
    if (thisCell === POWER_FOOD && !gPacman.isSuper) {
        gPacman.isSuper = true
        changeGhostsColor()
        var intervalId = setInterval(() => {
            gPacman.isSuper = false
            reviveGhosts()
            changeGhostsColor()
            clearInterval(intervalId)
        }, 5000)
    }
}
