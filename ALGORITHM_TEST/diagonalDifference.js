function diagonalDifference(matrix) {
    let primaryDiagonal = 0;
    let secondaryDiagonal = 0;
    
    for (let i = 0; i < matrix.length; i++) {
        primaryDiagonal += matrix[i][i];
        secondaryDiagonal += matrix[i][matrix.length - i - 1];
    }
    
    return Math.abs(primaryDiagonal - secondaryDiagonal);
}

const Matrix = [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9]
];

console.log(diagonalDifference(Matrix));
