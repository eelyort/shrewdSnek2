// Parent skeleton mutateMethod class
// Specifications
//  -Takes in "mutateParameters" and the "brain" and mutates accordingly
//  -Can mutate with set method, variable parameters
class mutateMethod{
    constructor(){

    }
    mutate(mutateParameters, brain){

    }
    // returns a copy of this mutateMethod
    cloneMe(){
        let clone = new mutateMethod();
        clone.mutate = this.mutate;
        return clone;
    }
}