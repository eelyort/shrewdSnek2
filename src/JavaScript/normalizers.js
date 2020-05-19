// objects (functions really) that are used to normalize a single layer
class BaseNormalizer extends Component{
    constructor(id){
        super(id);
    }
    normalizeOne(valIn){
        return valIn;
    }
    normalizeCol(colIn){
        for (let i = 0; i < colIn.length; i++) {
            colIn[i] = this.normalizeOne(colIn[i]);
        }
    }
    cloneMe(){
        return new BaseNormalizer();
    }
    static parse(str){
        return super.parse(str, normalizerPrototypes);
    }
}

// tanh function - NOTE: default
class TanhNormalizer extends BaseNormalizer{
    constructor(){
        super(0);

        this.componentName = "tanh Function Normalization";
        this.componentDescription = "This normalizes all values to between -1 and 1, is the best single node normalizer";
    }
    normalizeOne(valIn) {
        return Math.tanh(valIn);
    }
    cloneMe() {
        return new TanhNormalizer();
    }
}

// Z normalization - to standard normal distribution
class ZNormalizer extends BaseNormalizer{
    constructor(){
        super(1);

        this.mean = -999;
        this.stanDev = -999;

        this.componentName = "Z-Score Normalization";
        this.componentDescription = "This looks at the whole row and makes it so that it is normally distributed with mean 0 and standard deviation 1";
    }
    normalizeOne(valIn) {
        if(this.mean != -999 && this.stanDev != -999){
            return (valIn- this.mean)/this.stanDev;
        }
        return valIn;
    }
    normalizeCol(colIn) {
        let runningSum = 0;
        for (let i = 0; i < colIn.length; i++) {
            runningSum += colIn[i];
        }
        this.mean = runningSum/colIn.length;

        runningSum = 0;
        for (let i = 0; i < colIn.length; i++) {
            runningSum += Math.pow((colIn[i] - this.mean), 2);
        }
        this.stanDev = runningSum/colIn.length;

        let ans = super.normalizeCol(colIn);

        this.mean = -999;
        this.stanDev = -999;
    }
    cloneMe() {
        return new ZNormalizer();
    }
}

// min-max, linear shift to [0,1]
class MinMaxLinearNormalization extends BaseNormalizer{
    constructor(){
        super(2);

        this.min = 999;
        this.max = -999;

        this.componentName = "Min-Max Linearization";
        this.componentDescription = "Linearly scales the values down based off of the max and min so everything is [0, 1]"
    }
    normalizeOne(valIn) {
        if(this.min != 999 && this.max != -999) {
            return (valIn - this.min) / (this.max - this.min);
        }
        return valIn;
    }
    normalizeCol(colIn) {
        // find min
        this.min = colIn[0];
        for (let i = 1; i < colIn.length; i++) {
            if(colIn[i] < this.min){
                this.min = colIn[i];
            }
        }

        // find max
        this.max = colIn[0];
        for (let i = 1; i < colIn.length; i++) {
            if(colIn[i] > this.max){
                this.max = colIn[i];
            }
        }

        let ans = super.normalizeCol(colIn);

        this.min = 999;
        this.max = -999;
    }
    cloneMe() {
        return new MinMaxLinearNormalization();
    }
}

// treats the column as a vector, finds unit vector
class UnitVectorNormalization extends BaseNormalizer{
    constructor(){
        super(3);

        this.mag = -1;

        this.componentName = "Unit Vector Normalization";
        this.componentDescription = "This treats the column as a vector, finds unit vector";
    }
    normalizeOne(valIn) {
        if(this.mag != -1) {
            return valIn/this.mag;
        }
        return valIn;
    }
    normalizeCol(colIn) {
        let runningSum = 0;
        for (let i = 0; i < colIn.length; i++) {
            runningSum += Math.pow(colIn[i], 2);
        }
        this.mag = Math.sqrt(runningSum);

        let ans = super.normalizeCol(colIn);

        this.mag = -1;
    }
    cloneMe() {
        return new UnitVectorNormalization();
    }
}

const normalizerPrototypes = [TanhNormalizer.prototype, ZNormalizer.prototype, MinMaxLinearNormalization.prototype, UnitVectorNormalization.prototype];
