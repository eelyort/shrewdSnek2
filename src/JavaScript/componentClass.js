// this class is just a base class for all snake components, stores name and description
class Component{
    constructor(id, name = "", desc = "") {
        // class specific id for easier JSON.parse setting prototypes
        this.componentID = id;

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
            if(this.componentDescription.charAt(this.componentDescription.length - 1) === '.') {
                return this.componentDescription;
            }
            return this.componentDescription + ".";
        }
        return this.defaultDesc;
    }
    // turns this into a json object
    stringify(){
        return JSON.stringify(this);
    }
    cloneComponents(clone){
        clone.componentID = this.componentID;

        clone.componentName = this.componentName;
        clone.componentDescription = this.componentDescription
    }
    // override by children
    static parse(str, arr){
        let ans = JSON.parse(str);
        return Object.assign(arr[ans.componentID].cloneMe(), ans);
        // Object.setPrototypeOf(ans, arr[ans.componentID]);
        // return ans;
    }
    static OLDPARSE(str, arr){
        let ans = JSON.parse(str);
        Object.setPrototypeOf(ans, arr[ans.componentID]);
        return ans;
    }
}
