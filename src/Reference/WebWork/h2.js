class h2{
    constructor(callback){
        this.callback = callback;
    }
    run(){
        for (let i = 0; i < 100000000; i++) {

        }
        this.callback(i, i);
    }
}