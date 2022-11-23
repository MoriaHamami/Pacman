'use strict'

const GHOST = '&#9966'
var gGhosts = []
var gIntervalGhosts
var gKeepsColors = []

function createGhosts(board) {
    for (var i = 0; i < 3; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
    const ghost = {
        location: {
            i: 2,
            j: 6
        },
        currCellContent: FOOD,
        color: getRandomColor()
    }
    gGhosts.push(ghost)
    board[ghost.location.i][ghost.location.j] = GHOST
}


function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // figure out moveDiff, nextLocation, nextCell
    const moveDiff = getMoveDiff()
    const nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    }
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // return if cannot move
    if (nextCell === WALL) return
    if (nextCell === GHOST) return
    if (nextCell === POWER_FOOD) return
    if (nextCell === CHERRY) return

    if (nextCell === PACMAN && gPacman.isSuper) return

    // hitting a pacman? call gameOver
    if (nextCell === PACMAN) {
        gameOver()
        return
    }

    // moving from current location:
    // update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // update the DOM
    renderCell(ghost.location, ghost.currCellContent)

    // Move the ghost to new location:
    // update the model (save cell contents so we can restore later)
    ghost.currCellContent = nextCell
    ghost.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j] = GHOST
    //update the DOM
    renderCell(nextLocation, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    const color = gPacman.isSuper ? 'blue' : ghost.color
    return `<span style="color:${color};">${GHOST}</span>`
}

function changeGhostsColor() {
    for (var i = 0; i < gGhosts.length; i++) {
        renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }
}

function getGhostIdxByLocation(cellI, cellJ) {
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === cellI && gGhosts[i].location.j === cellJ) return i
    }
    return null
}

function reviveGhosts() {
    console.log(gDeadGhosts)
    const deadGhostsSize = gDeadGhosts.length
    for (var i = 0; i < deadGhostsSize; i++) {
        var currGhost = gDeadGhosts.pop(currGhost)
        gGhosts.push(currGhost)
    }
    gDeadGhosts = []
}