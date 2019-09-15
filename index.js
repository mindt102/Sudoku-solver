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
        inputBlocks[i].style.color = "black"
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
        else {map[row].push(
            {
                value: value
            } 
            )
        }    
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
    for (let e=0;e<lst.length;e++) {
        if (v == lst[e] || equalFunc(v,lst[e])) {return true}
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

// Remove possible answers from all peers of one square
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

// Find position with only one possibility and return the move
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
    let row = position[0]
    let col = position[1]
    map[row][col].value = value
    delete map[row][col].poss 
    removePoss(position,value)
    emptySpace--
    let inputBlocks = document.getElementsByTagName("input")
    inputBlocks[row*9+col].style.color = "blue"
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
    for (let p=0;p<pairsPositions.length;p++) {     // Delete values different from values in pairs in the pairs'positions
        let pos = pairsPositions[p]
        let possList = map[pos[0]][pos[1]].poss
        for (let i=0;i<possList.length;i++) {
            if (!inFunc(possList[i],pairsValues)) {
                mapChanged = true
                delFunc(possList[i],possList)
                i--
            }
        }
        printMap() 
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
                if (typeof(delVal) == "number") {
                    if (inFunc(delVal,possList)) {
                        mapChanged = true
                        delFunc(delVal,possList)
                        printMap()   
                    }
                }
                else {
                    for (let v=0;v<delVal.length;v++) {
                        if (inFunc(delVal[v],possList)) {
                            mapChanged = true
                            delFunc(delVal[v],possList)
                            
                        }
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

// Find positions with a number or a range of possibilities in a group
function findMultiplePoss (posList,possNumb) {
    let results = []
    for (let p=0;p<posList.length;p++) {
        let [row,col] = posList[p]
        if (map[row][col].value == 0) {
            let length = map[row][col].poss.length
            if (typeof(possNumb) == "number") {
                if (length == possNumb) {
                    results.push({
                        values: map[row][col].poss,
                        position: [row,col],
                    })
                }
            }
            else {
                if (possNumb[0] <= length && length <= possNumb[1]) {
                    results.push({
                        values: map[row][col].poss,
                        position: [row,col],
                    })
                }
            }   
        }
    }
    return results
}

function allGroupsPos () {
    let allGroups = []
    let boxCord = cross([0,3,6],[0,3,6])
    for (let i=0;i<9;i++) {
        allGroups.push(findRow(i),findCol(i),findBox(boxCord[i]))
    }
    return allGroups
}

// Find naked pairs to reduce possibities
function findNakedPairs () {
    let allGroups = allGroupsPos()
    // console.log("Finding naked pairs")
    for (let i=0;i<allGroups.length;i++) {
        let group = allGroups[i]
        let potential = findMultiplePoss(group,2)
        if (potential.length >= 2) {
            for (let j=0;j<potential.length-1;j++) {
                let firstElement = potential[j]
                let firstValues = firstElement.values
                for (let k=j+1;k<potential.length;k++) {
                    let secondElement = potential[k]
                    let secondValues = secondElement.values
                    if (equalFunc(firstValues,secondValues)) {
                        let pairsPositions = [firstElement.position,secondElement.position]
                        let pairsValues = firstElement.values
                        delPoss(findRelatedPos(pairsPositions),pairsValues,pairsPositions)
                        printMap()
                        if (mapChanged) {
                            console.log("Found naked pair")
                            console.log(pairsPositions)
                            console.log(pairsValues)
                            return
                        }
                    }
                }
            }
        }
    }
}

// Find hidden pairs and reduce possibilities from every groups
function findHiddenPairs () {
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
                            console.log("Found hidden pair")
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

function checkNakedPermutation(posList) {
    let posLength = posList.length
    let possList = []
    for (let i=0;i<posLength;i++) {
        let [row,col] = posList[i]
        let possibilities = map[row][col].poss
        if(possibilities.length > posLength) {
            return false
        }
        for (let j=0;j<possibilities.length;j++) {
            if (!inFunc(possibilities[j],possList)) {
                possList.push(possibilities[j])
            }
            if (possList.length > posLength) {
                return false
            }
        }
    }
    return true
}

// Count empty squares in a group
function countEmptySquare(posList) {
    let emptySquare = 0
    for (let i=0;i<posList.length;i++) {
        let [row,col] = posList[i]
        if (map[row][col].value == 0) {
            emptySquare++
        }
    }
    return emptySquare
}

function findNakedTriple () {
    let allGroups = allGroupsPos()              // Get a list of positions in all groups 
    for (let i=0;i<allGroups.length;i++) {      // Loop through every group
        let group = allGroups[i]                
        if (countEmptySquare(group) >= 6) {     // Only find a naked triple if the group has more than 6 empty spaces
            let potential = findMultiplePoss(group,[2,3])   // Get the list of all square with only 2 or 3 possibilities
            if (potential.length >= 3) {          
                // Loop through every posible position   
                for (let j=0;j<potential.length-2;j++) {
                    let firstElement = potential[j]
                    let firstValues = firstElement.values
                    for (let k=j+1;k<potential.length-1;k++) {
                        let secondElement = potential[k]
                        let secondValues = secondElement.values
                        for (let l=k+1;l<potential.length;l++) {
                            let thirdElement = potential[l]
                            // Check if 3 elements create a naked triple
                            if (checkNakedPermutation([firstElement.position,secondElement.position,thirdElement.position])) {
                                // Get three positions and values of the triple
                                let triplePositions = [firstElement.position,secondElement.position,thirdElement.position]
                                let tripleValues = []
                                for (let v=0;v<firstValues.length;v++) {
                                    if (!inFunc(firstValues[v],tripleValues)) {
                                        tripleValues.push(firstValues[v])
                                    }
                                }
                
                                for (let v=0;v<secondValues.length;v++) {
                                    if (!inFunc(secondValues[v],tripleValues)) {
                                        tripleValues.push(secondValues[v])
                                    }
                                }
                            
                                // Delete possibilities using the triple                               
                                delPoss(findRelatedPos(triplePositions),tripleValues,triplePositions)
                                printMap()
                                if (mapChanged) {
                                    console.log("Found naked triple")
                                    console.log(triplePositions)
                                    console.log(tripleValues)
                                    return
                                }
                            }
                        }
                    }
                }
            }
        }
    }    
}

// Reduce list 
function reduceList(lst) {
    let reducedList = []
    for (let i=0;i<lst.length;i++) {
        if (!inFunc(lst[i],reducedList)) {
            reducedList.push(lst[i])
        }
    }
    return reducedList
}


function findHiddenTriple () {
    let counterList =[].concat(rowCounter,colCounter,boxCounter)
    let potential = []
    for (let ct = 0;ct <counterList.length;ct++) {
        let group = counterList[ct]
        let posList = []
        let grpOrder = ct%9
        if (inFunc(group,rowCounter)) {
            posList = findRow(grpOrder)
        }
        else if (inFunc(group,colCounter)) {
            posList = findCol(grpOrder)
        }
        else {
            let allboxCord = cross([0,3,6],[0,3,6])
            posList = findBox(allboxCord[grpOrder])
        }
        if (countEmptySquare(posList) >= 7) {
            potential = findByAppearTimes(group,[2,3])
            if (potential.length >= 3) {
                for (let i=0;i<potential.length-2;i++) {            // Get the first value of potential
                    let firstElement = potential[i] 
                    for (let k=i+1;k<potential.length-1;k++) {    // Get the second value
                        let secondElement = potential[k]
                        for (let m=k+1;m < potential.length;m++) {     // Get the third element
                            let thirdElement = potential[m]
                            // Get the triple values
                            let allPositions = [].concat(firstElement.positions,secondElement.positions,thirdElement.positions)
                            if (reduceList(allPositions).length == 3) {
                                let triplePositions = reduceList(allPositions)
                                let tripleValues = [firstElement.value,secondElement.value,thirdElement.value]                        
                                
                                delPoss(findRelatedPos(triplePositions),tripleValues,triplePositions)
                                for (let n=0;n<3;n++) {
                                    let [row,col] = triplePositions[n]
                                    for (let o=0;o<map[row][col].poss.length;o++) {
                                        if(! inFunc(map[row][col].poss[o],tripleValues)) {
                                            delFunc(map[row][col].poss[o],map[row][col].poss)
                                            mapChanged = true
                                            o--
                                        }
                                    }
                                }
                                if (mapChanged) {
                                    console.log("Found hidden triple")
                                    console.log("value",tripleValues,"pos",triplePositions)
                                    printMap()
                                    return
                                }
                            }
                        }                        
                    }
                }
            }            
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
                        printMap()
                        return
                    }
                }
            }
        }
    }   
}

function findXWing() {
    // Find in rows
    let potential = []
    for (let i=0;i<9-1;i++) { // Loop through every collumn
        let col = colCounter[i] 
        potential = findByAppearTimes(col,2)    // Get all numbers only appear twice
        if (potential.length > 0) {             
            for (let j=0;j<potential.length;j++) {  // Loop through every potential number
                let value = potential[j].value          // Get the potential number
                let positions = potential[j].positions  // Get its positions
                for (let c=i+1;c<9;c++) {           // Loop through the rest col
                    let searchingValue = colCounter[c][value-1]     // Get details about the number
                    if (searchingValue.appearance == 2) {           // If it appears twice
                        let searchingPos = searchingValue.positions // Get its positions
                        // If both positions are in the row with the initial positions
                        if (positions[0][0] == searchingPos[0][0] & positions[1][0] == searchingPos[1][0]) {     
                            delPoss(findRow(positions[0][0]),value,[positions[0],searchingPos[0]])
                            delPoss(findRow(positions[1][0]),value,[positions[1],searchingPos[1]])
                            if (mapChanged) {
                                console.log("X-wing")
                                console.log(value)
                                console.log(positions)
                                console.log(searchingPos)
                                return
                            }
                        }
                    }
                }
            }
        }  
    }
    for (let i=0;i<9-1;i++) { // Loop through every row
        let row = rowCounter[i] 
        potential = findByAppearTimes(row,2)    // Get all numbers only appear twice
        if (potential.length > 0) {             
            for (let j=0;j<potential.length;j++) {  // Loop through every potential number
                let value = potential[j].value          // Get the potential number
                let positions = potential[j].positions  // Get its positions
                for (let r=i+1;r<9;r++) {           // Loop through the rest rows
                    let searchingValue = rowCounter[r][value-1]     // Get details about the number
                    if (searchingValue.appearance == 2) {           // If it appears twice
                        let searchingPos = searchingValue.positions // Get its positions
                        // If both positions are in the column with the initial positions
                        if (positions[0][1] == searchingPos[0][1] & positions[1][1] == searchingPos[1][1]) {     
                            delPoss(findCol(positions[0][1]),value,[positions[0],searchingPos[0]])
                            delPoss(findCol(positions[1][1]),value,[positions[1],searchingPos[1]])
                            if (mapChanged) {
                                console.log("X-wing")
                                console.log(value)
                                console.log(positions)
                                console.log(searchingPos)
                                return
                            }
                        }
                    }
                }
            }
        }  
    }


}

let map = [] // Initialize map
let emptySpace = 0 // Empty space counter

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

        // Find naked pairs to reduce possibilities
        if (!mapChanged) {
            // Find pairs from every group
            findNakedPairs()
            if(mapChanged) {continue} // While loop
        }

        // Find pairs to reduce possibilities
        if (!mapChanged) {
            // Find pairs from every groups
            findHiddenPairs()
            if(mapChanged) {continue} // While loop
        }

        // Find naked triple to reduce possibilities
        if (!mapChanged) {
            // Find naked triple from every groups
            findXWing()
            if(mapChanged) {continue} // While loop
        }

        if (!mapChanged) {
            // Find X-wing from every groups
            findNakedTriple()
            if(mapChanged) {continue} // While loop
        }

        if (!mapChanged) {
            // Find X-wing from every group
            findHiddenTriple()
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

    // Find naked pairs to reduce possibilities
    if (!mapChanged) {
        // Find pairs from every group
        findNakedPairs()
    }
    
    // Find pairs to reduce possibilities
    if (!mapChanged) {
        // Find pairs from every group
        findHiddenPairs()
    }

    // Find X-wing to reduce possibilities
    if (!mapChanged) {
        // Find X-wing from every group
        findXWing()
    }

    // Find naked triple to reduce possibilities
    if (!mapChanged) {
        // Find naked triple from every group
        findNakedTriple()
    }

    // Find hidden triple to reduce possibilities
    if (!mapChanged) {
        // Find hidden triple from every group
        findHiddenTriple()
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
        inputBlocks[i].style.color = "black"
    }
    inputBlocks[0].focus()
    document.getElementById("endbtns").style.display = "none"
    document.getElementById("beginbtns").style.display = "flex"
})

