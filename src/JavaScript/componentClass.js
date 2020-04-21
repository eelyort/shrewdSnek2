// this class is just a base class for all snake components, stores name and description
class SnakeComponent{
    constructor(name = "", desc = "") {
        this.componentName = name;
        this.componentDescription = desc;

        this.defaultName = "UNNAMED";
        this.defaultDesc = "No Description Found";
    }
    getComponentName(){
        if(this.componentName.length > 0){
            return this.componentName;
        }
        return this.defaultName;
    }
    getComponentDescription(){
        if(this.componentDescription.length > 0){
            return this.componentDescription;
        }
        return this.defaultDesc;
    }
}
