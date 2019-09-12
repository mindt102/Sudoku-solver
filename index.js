// Create table
function creatTable() {
    let table = document.getElementsByTagName("table")[0]
    let inputHTML = `<input type="text" onkeypress='return event.charCode >= 49 && event.charCode <= 57'></input>`
    
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
    inputBlocks[0].focus()
    for (let i=0;i<inputBlocks.length;i++) {
        let block = inputBlocks[i]
        block.addEventListener("keypress",function(e) {
            let clickedSquare = e.target
            let number = e.keyCode
            if (number >= 48 & number <= 57) {
                clickedSquare.value = ""
            }
        })
        block.addEventListener("keydown",function(e) {
            if (e.keyCode == 37) {
                if (i > 0) {
                    // inputBlocks[i].value = ""
                    inputBlocks[i-1].focus()
                }
            }
            else if (e.keyCode == 38) {
                if (i >= 9) {
                    // inputBlocks[i].value = ""
                    inputBlocks[i-9].focus()}
            }
            else if (e.keyCode == 39) {
                if (i < inputBlocks.length-1) {
                // inputBlocks[i].value = ""
                inputBlocks[i+1].focus()}
            }
            else if (e.keyCode == 40) {
                if (i < inputBlocks.length - 9) {
                    // inputBlocks[i].value = ""
                    inputBlocks[i+9].focus()}
            }
        })
    }
}

// Creat a map from input
function creatMap () {
    emptySpace = 0
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
        if (v==lst[i] || equalFunc(v,lst[i])) {return true}
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
                mapChanged = true
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
                mapChanged = true
                return [group[j].positions[0],j+1]
            }
        }
    }
    return []
}

// Find numbers that appear n times in a group
function findByAppearTimes(group,times) {
    let result = []
    for (let i=0;i<group.length;i++) {
        if (typeof(times) == "number") {
            if (group[i].appearance == times) {
                result.push(
                {
                    value:i+1,
                    positions: group[i].positions
                })
            }
        }
        else {
            if(times[0] <= group[i].appearance & group[i].appearance <= times[1]) {
                result.push(
                    {
                        value:i+1,
                        positions: group[i].positions
                    })
            }
        }
        
    }
    return result
}

// If two lists are the same return true
function equalFunc(lst1,lst2) {
    if (JSON.stringify(lst1) == JSON.stringify(lst2)) {return true}
    return false
}

// Delete possibilities from pairs
function deletePairsPoss (pairsValues,pairsPositions) {
    let relatedPos = findRelatedPos(pairsPositions) // Get a list of related positions of the pairs
    delPoss(relatedPos,pairsValues,pairsPositions)  // Delete values of pairs in other position 
    for (let p=0;p<pairsPositions.length;p++) {
        let pos = pairsPositions[p]
        let possList = map[pos[0]][pos[1]].poss
        for (let i=0;i<possList.length;i++) {
            if (!inFunc(possList[i],pairsValues)) {
                mapChanged = true
                delFunc(possList[i],possList)
            }
        } 
    }
}

// Delete possibilities with given locations and values (maybe exclude some postitions)
function delPoss (delPos,delVal,keepPos) {
    for (let p=0;p<delPos.length;p++) {
        let pos = delPos[p]                     // The current position
        let value = map[pos[0]][pos[1]].value       // Get the current value to check
        if (value == 0) {                           // If the position is empty 
            let possList = map[pos[0]][pos[1]].poss // Get the posibilities of the current position
                       
            // If the current postions is not one of the keep positions
            if (!inFunc(pos,keepPos)) {
                // Remove the delete value from its possibilities
                for (let v=0;v<delVal.length;v++) {
                    if (inFunc(delVal[v],possList)) {
                        mapChanged = true
                        delFunc(delVal[v],possList)
                        printMap()   
                    }
                }
            }    
        }
    }
}

// Return a list of related position(s) to one or more given positions
function findRelatedPos (pList) {
    let positionList = []
    let row = findRow(pList[0][0])
    let col = findCol(pList[0][1])
    let box = findBox(pList[0])

    if (pList.length > 1) {
        for (let i=1;i<pList.length;i++) {
            // If one position is in a different row
            if (pList[i][0] != pList[0][0]) { 
                row = [] // Remove the related row
            }
            // If one position is in a different col
            if (pList[i][1] != pList[0][1]) { 
                col = [] // Remove the related col
            }
            // If one positions is in a different box
            if (!equalFunc([],box) & !equalFunc(box,findBox(pList[i]))) {
                box = [] // Remove the related box
            }
        }
    }

    positionList = [].concat(row,col,box)
    return positionList
}

// Find pairs and reduce possibilities from every groups
function findPairs () {
    let potential = [] // Initialize a list of potential positions
    let counterList =[].concat(rowCounter,colCounter,boxCounter)

    // Loop through every group
    for (let ct=0; ct < counterList.length; ct++ ) {
        let group = counterList[ct]        // The current group
        potential = findByAppearTimes(group,2) // Get a list of all numbers appears twice in this group
        
        // If there are at least two numbers in the list  
        if (potential.length >= 2) {
            // Find if there are any pairs
            for (let i=0;i<potential.length - 1;i++) { // Loop through each position 
                for (let j=i+1;j<potential.length;j++) { // Loop through the rest
                    // If two numbers has the same positions
                    if (equalFunc(potential[i].positions,potential[j].positions)) {
                        let pairsValues = [potential[i].value,potential[j].value] // Get the value
                        let pairsPositions = potential[i].positions               // Get the positions
                        deletePairsPoss(pairsValues,pairsPositions)               // Delete posibilities
                        printMap()
                        if (mapChanged) {
                            console.log("Found pair")
                            console.log(pairsValues, pairsPositions)
                            break
                        }
                    }
                }
            }
            if (mapChanged) {break}
        }  
    }
}

function startSolving () {
    for (let row=0;row<9;row++) {
        for (let col=0;col < 9;col++){
            let pos = map[row][col]
            if (pos.value != 0) {removePoss([row,col],pos.value)}
            
        }
    }
    printMap()
    document.getElementById("beginbtns").style.display = "none"
    document.getElementById("solvebtns").style.display = "flex"
}

function finishSolving() {
    document.getElementById("solvebtns").style.display = "none"
    document.getElementById("endbtns").style.display = "flex"
}

function findAssociate() {
    let potential = [] // Initialize a list of potential positions
    let counterList =[].concat(rowCounter,colCounter,boxCounter)
    
    // Loop through every group
    for (let ct=0; ct < counterList.length; ct++ ) {
        let group = counterList[ct]        // The current group
        potential = findByAppearTimes(group,[2,3]) // Get a list of all numbers appears twice in this group    
        if (potential.length > 0) {
            for (let i=0;i<potential.length;i++) {
                let relatedPos = findRelatedPos(potential[i].positions) 
                if (relatedPos.length > 9) {
                    delPoss(relatedPos,[potential[i].value],potential[i].positions)
                    if (mapChanged) {
                        console.log("Found associate")
                        console.log(potential[i])
                        break
                    }
                }
            }
            if (mapChanged) {break}
        }
    }   
}

let map = [] // Initialize map
let emptySpace = 0 // EmptySpace counter

// Initialize counter
let rowCounter = []
let colCounter = []
let boxCounter = []
let mapChanged = false
creatTable()

let createbtn = document.getElementById("createbtn")
let loadbtn = document.getElementById("loadbtn")
let finishbtn = document.getElementById("finishbtn")
let solvebtn = document.getElementById("solvebtn")
let hintbtn = document.getElementById("hintbtn")

createbtn.addEventListener("click",function () {
    creatMap()
    startSolving()
}) 

loadbtn.addEventListener("click",function () {
    loadMap()
    startSolving()
})

solvebtn.addEventListener("click",function() {
    while (true) {
        mapChanged = false

        // Make moves with only one possibility
        let move = findOnePoss()
    
        // Make moves with digit appear only once in its group
        if (!mapChanged) {
            updateCounter()
            let counterList = [].concat(rowCounter,colCounter,boxCounter)
            move = findAppearOnce(counterList)
        }

        // Find associate to reduce possibilities
        if (!mapChanged) {
            // Find pairs from every groups
            findAssociate()
            if(mapChanged) {continue} // While loop
        }

        // Find pairs to reduce possibilites
        if (!mapChanged) {
            // Find pairs from every groups
            findPairs()
            if(mapChanged) {continue} // While loop
        }

        if (move.length != 0) {
            console.log(move)
            makeMove(move)
        }

        if (emptySpace == 0) {
            printMap()
            break //While loop
        }
        
        if (!mapChanged) {
            alert("Can't solve")
            break //While loop
        }
        
    }    //While loop
    finishSolving()
})

hintbtn.addEventListener("click",function () {
    mapChanged = false

    // Make moves with only one possibility
    let move = findOnePoss()

    // Make moves with digit appear only once in its group
    if (!mapChanged) {
        updateCounter()
        let counterList = [].concat(rowCounter,colCounter,boxCounter)
        move = findAppearOnce(counterList)
    }

    // Find associate to reduce possibilities
    if (!mapChanged) {
        // Find associate from every group
        findAssociate()
    }

    // Find pairs to reduce possibilites
    if (!mapChanged) {
        // Find pairs from every group
        findPairs()
    }

    if (emptySpace == 0) {
        printMap()
        alert("Done")
        finishSolving()
    }

    if (move.length != 0) {
        console.log(move)
        makeMove(move)
    }

    if (!mapChanged & emptySpace != 0) {
        alert("Can't solve")
        finishSolving()
    }
})

finishbtn.addEventListener("click",function () {
    let inputBlocks = document.getElementsByTagName("input")
    for (let i=0;i<inputBlocks.length;i++) {
        inputBlocks[i].value = ""
        inputBlocks[i].style.display = "inline-block"
    }
    inputBlocks[0].focus()
    document.getElementById("endbtns").style.display = "none"
    document.getElementById("beginbtns").style.display = "flex"
})

