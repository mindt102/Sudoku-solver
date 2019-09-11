// Create table
function creatTable() {
    let table = document.getElementsByTagName("table")[0]
    let inputHTML = `<input type="number" inputmode="numeric" pattern="[1-9]*" min="1" max="9">`
    
        // Add possible answers to each box
    let p_ans_containerHTML = "<div class='p-ans-container'>"
    for (let i=0;i<9;i++) {
        p_ans_containerHTML += `<div class="p-ans">${i+1}</div>`
    }
    p_ans_containerHTML += "</div>"
    
    let tdHTML = `<td>${inputHTML + p_ans_containerHTML}</td>`
    
    let trHTML = ``
    let tbodyHTML = ``
    
    for (let i=0;i<9;i++) {
        trHTML += tdHTML 
    }
    trHTML += "</tr>"
    for (let i=0;i<3;i++) {
        tbodyHTML += trHTML
    }
    
    for (let i=0;i<3;i++) {
        table.insertAdjacentHTML("beforeend",tbodyHTML)
    }
    
        // Add function to input square
    let inputBlocks = document.getElementsByTagName("input")
    for (let i=0;i<inputBlocks.length;i++) {
        let block = inputBlocks[i]
        block.addEventListener("keypress",function(e) {
            let clickedSquare = e.target
            let number = e.keyCode
            if (number >= 48 & number <= 57) {
                clickedSquare.value = ""
            }
        })
    }
}

// Creat a map from input
function creatMap () {
    map = []
    let row = -1
    let inputBlocks = document.getElementsByTagName("input")
    for (let i=0;i<inputBlocks.length;i++) {
        if (i%9 == 0) {
            map.push([])
            row += 1
        }
        let value = parseInt((inputBlocks[i].value))
        // If square is empty assign 0 and possibilities from 1 to 9
        if ( isNaN(value) ) {
            emptySpace++
            map[row].push(
                {
                    value:0,
                    poss: [1,2,3,4,5,6,7,8,9]
                }
            )
        }
        // Else assign value to the map
        else (map[row].push(
            {
                value: value
            }
        ))
    }
    localStorage.setItem("map",JSON.stringify(map))
    localStorage.setItem("emptySpace",JSON.stringify(emptySpace))
}

// Load the current map from local storage
function loadMap() {
    // Get map from local storage to debug
    emptySpace = JSON.parse(localStorage.getItem("emptySpace"))
    map = JSON.parse(localStorage.getItem("map"))
}

// If value in list return true
function inFunc(v,lst) {
    for (let i=0;i<lst.length;i++) {
        if (v==lst[i]) {return true}
    }
    return false
}

// Delete an element in a list by value
function delFunc(v,lst) {
    for (let i=0;i<lst.length;i++) {
        if(lst[i] == v) {lst.splice(i,1)}
    }
}

// Print value and possible answers
function printMap() {
    let allSquares = document.getElementsByTagName("td")
    for (let r=0;r<9;r++) {
        for (let c=0;c<9;c++) {
            // Each square in the map (has 2 layers)
            let tdSquare = allSquares[r*9+c]

            // Layer 1 (Input)
            let input = tdSquare.getElementsByTagName("input")[0] 

            // Layer 2 (divs contain possible answers)
            // Create a list contain all p-ans divs 
            let p_ans = tdSquare.getElementsByClassName("p-ans")

            // A possition in the map
            let position = map[r][c] 

            // If the possition is empty, print all possibilities
            if (position.value == 0 ) {
                // Hide the input layer
                input.style.display = "none"
                
                // Change the possibilities 
                    // Get all possiblities from the map data
                let allPAns = position.poss
                for (p=0;p<9;p++) {
                    if (inFunc(p+1,allPAns)) {
                        p_ans[p].style.color = "grey"
                    }
                    else {
                        p_ans[p].style.color = "white"
                    }
                }

            }
            // Else print the value
            else {
                input.style.display = "inline-block"
                input.value = map[r][c].value
            }
        }
    }

    
}

function findRow (r) {
    let positionList = []
    for (let i=0;i<9;i++) {
        positionList.push([r,i])
    }
    return positionList
}

function findCol (c) {
    let positionList = []
    for (let i=0;i<9;i++) {
        positionList.push([i,c])
    }
    return positionList
}

function cross(rowlst,collst) {
    let positionList = []
    for (let r=0;r<rowlst.length;r++) {
        for(let c=0;c<collst.length;c++) {
            positionList.push([rowlst[r],collst[c]])
        }
    }
    return positionList
}

function findBox ([r,c]) {
    let subrow = []
    let subcol = []

    if (r < 3) {subrow = [0,1,2]}
    else if(r<6) {subrow = [3,4,5]}
    else {subrow = [6,7,8]}

    if (c<3) {subcol = [0,1,2]}
    else if (c<6) {subcol = [3,4,5]}
    else {subcol = [6,7,8]}

    let positionList = cross(subrow,subcol)
    return positionList
}

// Remove possible answers from all peers 
function removePoss([r,c],v) {
    let areas = [].concat(findRow(r),findCol(c),findBox([r,c])) 
    for (let a=0;a<areas.length;a++) {
        let area = areas[a]
        let position = map[area[0]][area[1]] 
        if (position.value == 0) {
            delFunc(v,position.poss)
        }
    }
}

// Find position with only one possibility
function findOnePoss() {
    let move = []
    for(let r=0;r<9;r++) {
        for (let c=0;c<9;c++) {
            let pos = map[r][c]
            if (pos.value != 0) {continue}
            if (pos.poss.length == 1) {
                console.log("One possibilities")
                move = [[r,c],pos.poss[0]]
            }
        }
    }
    return move
}

// Make a move after receiving possition and value
function makeMove(move) {
    let position = move[0]
    let value = move[1]
    map[position[0]][position[1]].value = value
    delete map[position[0]][position[1]].poss 
    removePoss(position,value)
    emptySpace--
    printMap()
    return
}

// Create counter for rows, cols and boxes
function creatCounter() {
    let counter = []
    for (let i=0;i<9;i++) {
        counter.push([])
        for (let j=1;j<10;j++) {
            counter[i].push(
                {
                    appearance: 0,
                    positions: [],
                }
            )
        }
    }
    return counter
}

// Update counter for each group
function updateCounter() {
    rowCounter = creatCounter()
    colCounter = creatCounter()
    boxCounter = creatCounter()
    for (let r=0;r<9;r++) {
        for (let c=0;c<9;c++) {
            let pos = map[r][c]
            if (pos.value == 0) {
                let possList = pos.poss
                let currentRow = r
                let currentCol = c
                let currentBox = Math.floor(r/3)*3 + Math.floor(c/3)
                for (let p=0;p<possList.length;p++) {
                    let possValue = possList[p]
                    rowCounter[currentRow][possValue - 1].appearance ++
                    colCounter[currentCol][possValue - 1].appearance ++
                    boxCounter[currentBox][possValue - 1].appearance ++

                    rowCounter[currentRow][possValue - 1].positions.push([r,c])
                    colCounter[currentCol][possValue - 1].positions.push([r,c])
                    boxCounter[currentBox][possValue - 1].positions.push([r,c])
                }
            }
        }
    }
}

// Find move appear once in its group
function findAppearOnce (counterList) {
    for (let i=0;i<counterList.length;i++) {
        let group = counterList[i]
        for (let j=0;j<group.length;j++) {
            if (group[j].appearance == 1) {
                console.log("Appear once")
                return [group[j].positions[0],j+1]
            }
        }
    }
    return []
}

let map = [] // Initialize map
let emptySpace = 0 // EmptySpace counter

// Initialize counter
let rowCounter = []
let colCounter = []
let boxCounter = []
creatTable()
let startbtn = document.getElementById("start-btn")
startbtn.addEventListener ('click',function() {
    if (startbtn.textContent == "Start") {
        // creatMap()
        loadMap()
        // printMap()
        for (let row=0;row<9;row++) {
            for (let col=0;col < 9;col++){
                let pos = map[row][col]
                if (pos.value != 0) {removePoss([row,col],pos.value)}
                
            }
        }
        printMap()
        startbtn.textContent = "Solve"
    }
    else {
        while (true) {

            // Make moves with only one possibility
            let move = findOnePoss()

            // Make moves with digit appear only once in its group
            if (move.length == 0) {
                updateCounter()
                let counterList = [].concat(rowCounter,colCounter,boxCounter)
                move = findAppearOnce(counterList)
            }

            if (move.length != 0) {
                console.log(move)
                makeMove(move)
            }
            else {
                alert("Can't solve")
                break //While loop
            }
            if (emptySpace == 0) {
                printMap()
                break //While loop
            }
        }    //While loop
    }
})