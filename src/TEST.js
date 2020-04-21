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

// let file = new File("./playerControlled.txt");
// console.log(file);

class test1{
    constructor(){

    }
    a(){
        console.log("1:a");
    }
    b(){
        for (let i = 0; i < 5; i++) {
            this.a();
        }
    }
}

class test2 extends test1{
    constructor(){
        super();
    }
    a(){
        console.log("2:a");
    }
}

let ha = new test2();
ha.b();

console.log(`   ${0}`.substring(-5));
console.log(`             ${0}`.substring(-5));
