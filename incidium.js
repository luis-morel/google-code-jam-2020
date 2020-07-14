/*
========================================================

    GOOGLE CODE JAM
    April 2020

    Annual coding competition hosted and administered
    by Google.

========================================================


Problem Name: 

    INCIDIUM

Problem Description: 

    Incidium means "trace" in Latin. In this problem we work with Latin squares and matrix traces.

    A Latin square is an N-by-N square matrix in which each cell contains one of N different values,
    such that no value is repeated within a row or a column. In this problem, we will deal only with
    "natural Latin squares" in which the N values are the integers between 1 and N.

    The trace of a square matrix is the sum of the values on the main diagonal (which runs from the
    upper left to the lower right).

    Given values N and K, produce any N-by-N "natural Latin square" with trace K, or say it is
    impossible. For example, here are two possible answers for N = 3, K = 6. 

    2 1 3   3 1 2
    3 2 1   1 2 3
    1 3 2   2 3 1

    Input

    The first line of the input gives the number of test cases, T. T test cases follow. Each consists
    of one line containing two integers N and K: the desired size of the matrix and the desired trace.

    Output

    For each test case, output one line containing Case #x: y, where x is the test case number
    (starting from 1) and y is IMPOSSIBLE if there is no answer for the given parameters or
    POSSIBLE otherwise. In the latter case, output N more lines of N integers each, representing
    a valid "natural Latin square" with a trace of K, as described above.

    Limits

    Time limit: 20 seconds per test set.
    Memory limit: 1GB.
    N ≤ K ≤ N-squared.

    Test set 1 (Visible Verdict)

    T = 44.
    2 ≤ N ≤ 5.

    Test set 2 (Hidden Verdict)

    1 ≤ T ≤ 100.
    2 ≤ N ≤ 50.

    Sample

    Input        Output

                Case #1: POSSIBLE            
    2            2 1 3
    3 6          3 2 1
    2 3          1 3 2
                Case #2: IMPOSSIBLE


    Sample Case #1 is the one described in the problem statement. Sample Case #2 has no answer. The only 
    possible 2-by-2 "natural Latin squares" are as follows:
    1 2   2 1
    2 1   1 2
    These have traces of 2 and 4, respectively. There is no way to get a trace of 3.
*/

/*
=================================================================

    PROPOSED SOLUTION

    Developer:      Luis Morel 
                    https://www.linkedin.com/in/luis-morel
    Date:           Saturday, April 4, 2020
    Environment:    JavaScript/Node.js (v12.16.1)
    Results:        Passed the sample test case(s) but failed 
                    one or more live test cases.
    Notes:          Code passed all local tests. Wish Google
                    would have shared failed cases.

=================================================================
*/

const buildLatinSquares = (ordered, mSize, mTrace) => {
    let latinSquares = {
            matrices: [],
            trace: mTrace
        },
        matrix = [];
    if (ordered) {
        // Generate Ordered Latin Squares
        for (let i = 0; i < mSize; i++) {
            let matrixRow = [],
                value = i + 1;
            for (let j = 0; j < mSize; j++) {
                if (value <= mSize)
                    matrixRow.push(value++);
                else {
                    value = 1;
                    matrixRow.push(value++);
                }
            }
            matrix.push(matrixRow);
        };
        latinSquares.matrices.push(matrix);
        (shuffleLatinSquare(matrix, mSize)).forEach((newMatrix) => latinSquares.matrices.push(newMatrix));
    } else {
        // Generate Reversed Latin Squares
        for (let i = mSize; i > 0; i--) {
            let matrixRow = [],
                value = i;
            for (let j = 0; j < mSize; j++) {
                if (value >= 1) {
                    matrixRow.push(value--);
                } else {
                    value = mSize;
                    matrixRow.push(value--);
                }
            }
            matrix.push(matrixRow);
        };
        latinSquares.matrices.push(matrix);
        (shuffleLatinSquare(matrix, mSize)).forEach((newMatrix) => latinSquares.matrices.push(newMatrix));
    }
    return latinSquares;
}; // End of buildLatinSquare()

const computeMatrixTrace = (matrix) => {
    let matrixTrace = parseInt(matrix[0][0]);
    for (let i = 1; i < matrix.length; i++) {
        matrixTrace += parseInt(matrix[i][i]);
    };
    return matrixTrace;
}; // End of computeMatrixTrace()

const evaluateTestCases = (input) => {
    const testCases = (input.shift())[0];
    let outComes = [];
    for (let i = 0; i < testCases; i++) {
        // Build Natural Latin Squares
        let matrixParams = input.shift(),
            matrixSize = parseInt(matrixParams[0]),
            matrixTrace = parseInt(matrixParams[1]),
            latinSquares = buildLatinSquares(true, matrixSize, matrixTrace);
        // Compute Trace for Each NLS; Exit Loop if Trace (K) is Found
        let traceResult = findTrace(latinSquares);
        if (traceResult.status === 'POSSIBLE') {
            outComes.push({
                name: `Case #${i + 1}:`,
                matrix: traceResult.matrix,
                status: traceResult.status
            });
            continue;
        } else {
            let reversedLatinSquares = buildLatinSquares(false, matrixSize, matrixTrace);
            let traceResult = findTrace(reversedLatinSquares);
            if (traceResult.status === 'POSSIBLE') {
                outComes.push({
                    name: `Case #${i + 1}:`,
                    matrix: traceResult.matrix,
                    status: traceResult.status
                });
                continue;
            };
        };
        outComes.push({
            name: `Case #${i + 1}:`,
            matrix: traceResult.matrix,
            status: 'IMPOSSIBLE'
        });
    };
    return outComes;
}; // End of evaluateTestCases()

const findTrace = (ls) => {
    const desiredTrace = ls.trace,
        lsLength = ls.matrices.length,
        results = {
            matrix: [],
            status: ''
        };
    for (let i = 0; i < lsLength; i++) {
        let trace = computeMatrixTrace(ls.matrices[i]);
        if (trace === desiredTrace) {
            results.matrix = ls.matrices[i];
            results.status = 'POSSIBLE'
            return results;
        };
    };
    return results;
}; // End of findTrace()

const shuffleLatinSquare = (matrix, size) => {
    let latinSquare = [].concat(matrix),
        newLatinSquares = [];
    for (let i = 1; i < size; i++) {
        latinSquare.push(latinSquare.shift());
        let newMatrix = [].concat(latinSquare);
        newLatinSquares.push(newMatrix);
    };
    return newLatinSquares;
}; // End of shuffleLatinSquare()

// Process Input; Evaluate Test Cases; Output Solution Results
let readline = require("readline"),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    }),
    codeJamInput = [],
    results = [];

rl.on('line', (line) => {
    let input = line.split(" ");
    if (input[0] === 'exit' || input[0] === 'quit')
        rl.close();
    else
        codeJamInput.push(line.split(" "));
});

rl.on('close', () => {
    results = evaluateTestCases(codeJamInput);
    results.forEach((testCase) => {
        if (testCase.status === 'POSSIBLE') {
            console.log(testCase.name, testCase.status);
            testCase.matrix.forEach((row) => console.log(row.join(" ")));
        }
        else
            console.log(testCase.name, testCase.status);
    });
});

rl.on('SIGINT', () => {
    results = evaluateTestCases(codeJamInput);
    results.forEach((testCase) => {
        if (testCase.status === 'POSSIBLE') {
            console.log(testCase.name, testCase.status);
            testCase.matrix.forEach((row) => console.log(row.join(" ")));
        }
        else
            console.log(testCase.name, testCase.status);
    });
});