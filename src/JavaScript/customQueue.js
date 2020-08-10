// queue implementation
class QueueNode{
    constructor(valueIn, nextNode) {
        this.myVal = valueIn;
        this.myNext = nextNode;
    }
}
class CustomQueue{
    constructor(){
        this.startNode = null;
        this.endNode = null;
        this.size = 0;
    }
    enqueue(valueIn){
        let newNode = new QueueNode(valueIn, null);
        if(this.size > 0) {
            this.endNode.myNext = newNode;
            this.endNode = newNode;
        }
        // when adding first one
        else{
            this.startNode = newNode;
            this.endNode = newNode;
        }
        this.size++;
    }
    pushFront(valueIn){
        let newNode = new QueueNode(valueIn, this.startNode);
        this.startNode = newNode;
        this.size++;
    }
    poll(){
        let valOut = this.startNode.myVal;
        this.startNode = this.startNode.myNext;
        this.size--;
        return valOut;
    }
    peek(){
        return this.startNode.myVal;
    }
    logQueue(){
        let str = "Custom Queue: ";
        let curr = this.startNode;
        while(curr != null){
            str += curr.myVal + ", ";
            curr = curr.myNext;
        }
        return str;
    }
    map(func){
        let index = 0;
        let curr = this.startNode;
        let ans = [];
        while(curr){
            ans.push(func(curr.myVal, index));

            curr = curr.myNext;
            index++;
        }
        return ans;
    }
    // these two only work for primitive types
    stringify(){
        // save the data to an array
        let temp = Array.apply(null, {length: this.size});
        let curr = this.startNode;
        for (let i = 0; i < temp.length; i++) {
            temp[i] = curr.myVal;
            curr = curr.myNext;
        }

        return JSON.stringify(temp);
    }
    static parse(str){
        let ans = new CustomQueue();
        let arr = JSON.parse(str);

        for (let i = 0; i < arr.length; i++) {
            ans.enqueue(arr[i]);
        }

        return ans;
    }
}