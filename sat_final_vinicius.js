var fileName = ".\hole1.cnf";
const fs = require('fs');
var contadorInt = 0;
var contadorBin = parseInt(contadorInt);
var contadorBinString = (contadorInt).toString(2);
var contadorCla = 0;
var currentAssignment = contadorBinString;
var qtVarG;
var qtClaG;
var assignment;

function readFormula(fileName) {

    let text = fs.readFileSync(fileName, 'utf8').split("\n");

    let qtVariables = 0;
    let qtClauses = 0;
    let lineOfClauses = "";

    for (var k = 0; k < text.length; k++) {

        let firstChar = text[k].charAt(0);

        if (firstChar == "c"){
            //does NOTHING
        } else if(firstChar == "p") {
            let pos = text[k].split(" ");

            qtVariables = parseInt(pos[2]);
            qtClauses = parseInt(pos[3]);
            qtVarG = qtVariables;
            qtClaG = qtClauses;


        } else {
            lineOfClauses = lineOfClauses.concat(" ", text[k]);
        };

        let clauseLine = lineOfClauses.split("0");
    };


    let clauses = readClauses(clauseLine)
    let variables = readVariables(clauses)



    let specOk = checkProblemSpecification(lineOfClauses, qtClauses, qtVariables)

    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }
    return result
}


function readClauses (clauseLine){

    var clausesArray = [];

    for (let i = 0; i < clauseLine.length; i++) {


        let eachVariable = clauseLine[i].split(" ");

        for (let j = 0; j < eachVariable.length; j++){

            if (eachVariable[j] != ""){
                eachVariable.push(parseInt(eachVariable[j], 10));
            };

        };

        clauses.push(eachVariable);
    };

    return clauses;


}

function readVariables(qtVariables){

    let allZeros = [];

    for (let i = 0; i < qtVariables; i++){

        allZeros.push("0");

    };

    return allZeros;


}

function checkProblemSpecification(lineOfClauses, qtClauses, qtVariables) {

    let highest = highestValue(lineOfClauses);

    let splitClauses = lineOfClauses.split(" 0");

    splitClauses.pop();
    var clausesArray = splitClauses;
    let specOk = false;

    if (qtClauses == splitClauses.length){

        if (qtVariables == highest){

            specOk = true;

        } else {
            specOk = false;
        };
    } else {

        specOk = false;
    };

    return specOk;

}


function highestValue(lineOfClauses) {

    var arr = lineOfClauses.split(" ").map(Number);

    var largest = arr[0];

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > largest) {
            largest = arr[i];
        };
    } ;


    return largest;
}


function updateCount() {
    contadorInt++;
    contadorBin = parseInt(contadorInt);
    contadorBinString = (contadorInt).toString(2);
    currentAssignment = contadorBinString;


}
function nextAssignment(currentAssignment){
    updateCount;
    var newAssignment = contadorBinString;
    while(contadorBinString.length < qtVarG){

        newAssignment = '0' + newAssignment;
    }

    return newAssignment;
}
function check(){
    let check1 = true;

    var contCheck1 = 1;
    for(let i = 0; i <= qtClaG && check1 == true; i++) {
        let check2 = false;
        var contCheck2 = 1;

        for(let j = 0; j <= qtVarG && check2 == false; j++)


        if (Math.abs(clausesArray[i][j]) == contCheck2) {
                if (clausesArray[i][j] > 0) {
                    if (contadorBinString[Math.abs(clausesArray[i][j]) - 1] == 1) {
                        check2 = true;
                    }
                } else if (clausesArray[i][j] < 0) {
                    if (contadorBinString[Math.abs(clausesArray[i][j]) - 1] == 0) {
                        check2 = true;
                    }
                }
            }
        contCheck2++;
        if(check2 == false){
            check1 = false;
        }
    }
    if(check1){
        return true;
    } else{
        return false;
    }
}


function doSolve(clauses, assignment) {
    let isSat = false

    while (!isSat) {
        check();
        if(contadorInt != qtVarG && !check) {
            assignment = nextAssignment(assignment);

        } else if (check) {
            isSat = true;
        }
    }

    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment;
    }
    return result;
}
