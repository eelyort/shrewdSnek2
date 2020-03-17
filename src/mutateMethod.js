// Parent skeleton mutateMethod class
// Specifications
//  -Takes in "mutateParameters" and the "brain" and mutates accordingly
//  -Can mutate with set method, variable parameters
class MutateMethod{
    constructor(){
        // alert("Mutate Method");
    }
    mutate(mutateParameters, brain){

    }
    // returns a copy of this mutateMethod
    cloneMe(){
        let clone = new MutateMethod();
        clone.mutate = this.mutate;
        return clone;
    }
}