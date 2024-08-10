function reverseAlphabet(str) {
    const alphabets = str.replace(/[^a-zA-Z]/g, '');
    const reversed = alphabets.split('').reverse().join('');
    const number = str.replace(/[a-zA-Z]/g, '');
    return reversed + number;
}

const str = "NEGIE1";
console.log(reverseAlphabet(str));
