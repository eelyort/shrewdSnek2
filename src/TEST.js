let funcs = [
    function () {
        console.log("hi1");
    },
    function(two) {
        console.log("hi2: " + two);
    }
];

funcs[1](354);

let a = funcs[0];
console.log(a);
a();

let b;
console.log(b);

console.log(b === undefined);

let file = new File("./playerControlled.txt");
console.log(file);
