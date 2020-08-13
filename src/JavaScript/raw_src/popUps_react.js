// popup to select a loaded snake - 1
class SelectSnakePopUpREACT extends React.Component{
    constructor(props){
        super(props);

        this.state={
            errorText: "",
            deleteConfirmationUp: false
        };

        this.editButton = this.editButton.bind(this);
        this.deleteButton = this.deleteButton.bind(this);
        this.cloneButton = this.cloneButton.bind(this);
        this.saveButton = this.saveButton.bind(this);
        this.changeErrorText = this.changeErrorText.bind(this);
    }
    render() {
        const {metaInfo: metaInfo, selectedSnake: selectedSnake, selectedSnakeGen: selectedSnakeGen, loadedSnakesIn: loadedSnakesIn} = this.props;

        const editable = !(selectedSnake < protectedSnakes);

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        // delete confirmation box
        let deleteBox = null;
        if(this.state.deleteConfirmationUp) {
            deleteBox = (
                <div className={"confirmation_box"}>
                    <h3>Are you sure you want to delete this snake?</h3>
                    <div>
                        <Button onClick={() => this.setState(() => ({deleteConfirmationUp: false}))}>No</Button>
                        <Button onClick={this.deleteButton}>Yes</Button>
                    </div>
                </div>
            );
        }

        if(selectedSnakeGen >= loadedSnakesIn[selectedSnake].getLength()){
            popUpFuncs.changeSelectedGen(loadedSnakesIn[selectedSnake].getLength()-1);
            return null;
        }

        return (
            <PopUp className={"background selectSnake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={() => popUpFuncs.close()}>
                <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                    <span>{this.state.errorText}</span>
                </FadeDiv>
                <div className={"container"}>
                    {deleteBox}
                    <div className={"carousel_parent"}>
                        <VerticalCarousel delayInitialScroll={1} selected={selectedSnake} items={loadedSnakesIn} select={popUpFuncs.changeSelected}>
                            {loadedSnakesIn.map((val, i) => {
                                return(
                                    <h3>{val.getComponentName()}</h3>
                                );
                            })}
                        </VerticalCarousel>
                    </div>
                    <div className={"background text_card"}>
                        <div className={"inline_block_parent"}>
                            <h1>{loadedSnakesIn[selectedSnake].getComponentName()}</h1>
                            <label htmlFor={"generation_number"}>Generation: </label>
                            <Select initVal={selectedSnakeGen} name={"generation_number"} onSelect={popUpFuncs.changeSelectedGen}>
                                {loadedSnakesIn[selectedSnake].snakes.map((value, index) => {
                                    return(
                                        <option value={index}>{((value.generationNumber) ? (value.generationNumber) : (index))}</option>
                                    );
                                })}
                            </Select>
                        </div>
                        <SnakeDetails snake={loadedSnakesIn[selectedSnake].snakes[selectedSnakeGen]} />
                        <div className={"button_div"}>
                            {((editable) ? (
                                <Fragment>
                                    <Button onClick={this.editButton}>Edit</Button>
                                    <Button onClick={this.deleteButton}>Delete</Button>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Button onClick={() => this.changeErrorText("(Snake cannot be edited, try cloning then editing instead.)")} className={"faded"}>Edit</Button>
                                    <Button onClick={() => this.changeErrorText("(This snake is protected and cannot be deleted.)")} className={"faded"}>Delete</Button>
                                </Fragment>
                            ))}
                            <Button onClick={this.cloneButton}>Clone</Button>
                            <Button onClick={popUpFuncs.close}>Finish</Button>
                            {/*<Button className={"faded"} onClick={() => null}>Save</Button>*/}
                            <Button onClick={this.saveButton}>Save</Button>
                        </div>
                    </div>
                </div>
            </PopUp>
        );
    }
    editButton(){
        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        popUpFuncs.close(2, this.props.selectedSnake);
    }
    deleteButton(){
        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        if(this.state.deleteConfirmationUp) {
            popUpFuncs.spliceLoaded(this.props.selectedSnake, 1);
            popUpFuncs.changeSelected(this.props.selectedSnake - 1);
            this.setState(() => ({deleteConfirmationUp: false}));
        }
        else{
            this.setState(() => ({deleteConfirmationUp: true}));
        }
    }
    cloneButton(){
        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        let species = this.props.loadedSnakesIn[this.props.selectedSnake].cloneSpecies();
        species.setNameClone();

        popUpFuncs.spliceLoaded(this.props.loadedSnakesIn.length, 0, species);
        popUpFuncs.changeSelected(this.props.loadedSnakesIn.length-1);
    }
    saveButton(){
        const {metaInfo: metaInfo, selectedSnake: selectedSnake, selectedSnakeGen: selectedSnakeGen, loadedSnakesIn: loadedSnakesIn} = this.props;

        console.log("todo save button - generation");
        console.log("todo save button - snake species");
        // console.log("todo save button - snake individual");

        // // save a snakeSpecies - doesn't work on mobile
        // // create a text area with the snake
        // const el = document.createElement('textarea');
        // el.value = loadedSnakesIn[selectedSnake].stringify();
        // document.body.appendChild(el);
        // // select it
        // el.select();
        // // copy
        // document.execCommand("copy");
        // // remove
        // document.body.removeChild(el);

        // save a snake
        // create a text area with the snake
        const el = document.createElement('textarea');
        el.value = loadedSnakesIn[selectedSnake].snakes[selectedSnakeGen].cloneMe().stringify();
        document.body.appendChild(el);
        // select it
        el.select();
        el.setSelectionRange(0, 9999999999); /*For mobile devices*/
        // copy
        document.execCommand("copy");
        // remove
        document.body.removeChild(el);

        this.changeErrorText("(Snake copied to clipboard)");
    }
    changeErrorText(text, callback = (() => null)){
        if(!this.state.errorText){
            this.setState((state) => ({errorText: text}), callback);
        }
        else if(this.state.errorText.length < text.length){
            this.setState((state) => ({errorText: text}), callback);
        }
        else{
            if(this.state.errorText === text){
                this.setState((state) => ({errorText: (text + " ")}), callback);
            }
            else{
                this.setState((state) => ({errorText: text}), callback);
            }
        }
    }
}

// popup to create/edit a snake - 2
class CreateSnakePopUpREACT extends React.Component{
    constructor(props){
        super(props);

        // snake saved
        this.saved = true;
        // change in inputs or brain
        this.deepChanges = 0;

        this.state={
            snake: null,
            errorText: "",
            confirmationBox: false,
            quitConfirmation: false
        };

        this.updateSnake = this.updateSnake.bind(this);
        this.createBlankSnake = this.createBlankSnake.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.saveAsNew = this.saveAsNew.bind(this);
        this.modifySpecies = this.modifySpecies.bind(this);
        this.changeErrorText = this.changeErrorText.bind(this);
        this.loadFromString = this.loadFromString.bind(this);
    }
    render() {
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        console.log(`render(), saved: ${this.saved}`);

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        // nothing to display
        if(!this.state.snake){
            return (
                <PopUp className={"background create_snake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={() => popUpFuncs.close()}>
                    <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                        <span>{this.state.errorText}</span>
                    </FadeDiv>
                    <div className={"container"}>
                        <div className={"text_card background"}>
                            <div className={"waiting_box"}>
                                <h2>Welcome to the snake creator!</h2>
                                <p>
                                    In general, it is recommended to use a pre-existing snake, such as "Basic Neural-Net Snake" as a template for creating new snakes.
                                    To do so, click the button below and hit "edit" on whichever snake template you wish to use.
                                    Do note that while some snakes cannot be edited, you may simply clone them then edit the clone.
                                </p>
                                <Button onClick={() => popUpFuncs.close(1)}>Select a Snake</Button>{"\n"}
                                <h4>Warning: editing then saving a snake which has multiple generations will delete all generations other than the first.</h4>
                                <p>
                                    Otherwise, if you wish to create a new, blank snake, please click the button below.
                                    Note that the snake will not be saved/stored until you press the "save" button.
                                </p>
                                <Button onClick={this.createBlankSnake}>Create a Blank Snake</Button>
                                <p>
                                    Lastly, to load a snake you previously saved, paste the result into this box.
                                </p>
                                <TextArea onChange={this.loadFromString}>
                                    <p className={"paste_saved"} />
                                </TextArea>
                            </div>
                        </div>
                    </div>
                </PopUp>
            );
        }

        let confirmation = null;
        if(this.state.confirmationBox){
            confirmation = (
                <div className={"confirmation_box"}>
                    <h3>Are you sure you want to override the previous version of this snake?{((this.deepChanges > 0) ? (" Due to changes in inputs/brain, saving this snake will erase all evolution progress.") : (""))}</h3>
                    <div>
                        <Button onClick={() => this.setState(() => ({confirmationBox: false}))}>Cancel</Button>
                        <Button onClick={() => {
                            this.setState(() => ({confirmationBox: false}), () => this.saveAsNew());
                        }}>Save as New Snake</Button>
                        <Button onClick={this.saveResults}>Yes, Override</Button>
                    </div>
                </div>
            );
        }
        let quitConfirmation = null;
        if(this.state.quitConfirmation){
            quitConfirmation = (
                <div className={"confirmation_box"}>
                    <h3>Are you sure you want to quit without saving?</h3>
                    <div>
                        <Button onClick={() => this.setState(() => ({quitConfirmation: false}))}>Cancel</Button>
                        <Button onClick={() => this.setState(() => ({quitConfirmation: false}), () => this.saveResults())}>No, Save Snake</Button>
                        <Button onClick={() => popUpFuncs.close()}>Yes, Quit Without Saving</Button>
                    </div>
                </div>
            );
        }

        return (
            <PopUp className={"background create_snake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={() => {
                console.log(`closefunc, saved: ${this.saved}`);
                if(!this.saved) {
                    this.setState(() => ({quitConfirmation: true}))
                }
                else{
                    popUpFuncs.close();
                }
            }}>
                <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                    <span>{this.state.errorText}</span>
                </FadeDiv>
                <div className={"container"}>
                    {confirmation}
                    {quitConfirmation}
                    <div className={"text_card background"}>
                        <SnakeDetailsEdit snake={this.state.snake} tellChange={() => {
                            console.log("tellChange");
                            this.saved = false;
                        }} tellDeepChange={(revertAmount) => {
                            console.log(`tell deep change, revert: ${revertAmount}`);
                            if(revertAmount){
                                this.deepChanges -= revertAmount;
                            }
                            else{
                                this.deepChanges++;
                            }
                            console.log(`deepChanges: ${this.deepChanges}`);
                        }}/>
                        <div className={"button_div"}>
                            <Button onClick={this.saveResults}>Save</Button>
                        </div>
                    </div>
                </div>
            </PopUp>
        );
    }
    // chose active snake if none
    updateSnake(){
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        if(!this.state.snake){
            if(metaInfo != null){
                this.setState((state) => ({snake: loadedSnakesIn[metaInfo].cloneMe()}));
            }
            // do nothing if no metaInfo (popup opened directly instead of from selectSnake)
        }
    }
    createBlankSnake(){

    }
    saveResults(){
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        // replace an existing snake
        if(metaInfo != null){
            if(this.state.confirmationBox) {
                this.setState(() => ({confirmationBox: false}), () => {
                    // change input/brain, delete all generations except one
                    if(this.deepChanges > 0) {
                        popUpFuncs.spliceLoaded(metaInfo, 1, this.state.snake);
                    }
                    // surface changes: name, desc, params | keep all generations
                    else{
                        let newSnakes = this.modifySpecies();
                        popUpFuncs.spliceLoaded(metaInfo, 1, newSnakes);
                    }
                    // mark saved
                    popUpFuncs.changeSelected(metaInfo);
                    this.changeErrorText("(Save Successful)", () => {
                        this.saved = true;
                    });
                });
            }
            else{
                this.setState(() => ({confirmationBox: true}));
            }
        }
        // add another
        else{
            this.saveAsNew();
            // popUpFuncs.close(1);
        }
    }
    saveAsNew(){
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        this.state.snake.setNameClone();
        this.setState((state) => ({
            snake: state.snake.cloneMe()
        }), () => {
            // change input/brain, delete all generations except one
            if(this.deepChanges > 0 || !metaInfo) {
                popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, this.state.snake.cloneMe());
            }
            // surface changes: name, desc, params | keep all generations
            else{
                let newSnakes = this.modifySpecies();
                popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, newSnakes);
            }
            // mark saved
            popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
            popUpFuncs.close(1);
        });
    }
    modifySpecies(){
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        const newSnek = this.state.snake;
        const oldSpecies = loadedSnakesIn[metaInfo];
        let ans = oldSpecies.snakes.map(((value, index) => {
            value = value.cloneMe();
            value.setName(newSnek.componentName);
            value.componentDescription = newSnek.componentDescription;
            value.startHeadPos = newSnek.startHeadPos;
            value.startLength = newSnek.startLength;
            value.appleVal = newSnek.appleVal;
            value.gridSize = newSnek.gridSize;
            return value;
        }));
        console.log(`modifySpecies(): ans: ${ans}`);
        return ans;
        // return oldSpecies.snakes.map(((value, index) => {
        //     value.setName(newSnek.componentName);
        //     value.componentDescription = newSnek.componentDescription;
        //     value.startHeadPos = newSnek.startHeadPos;
        //     value.startLength = newSnek.startLength;
        //     value.appleVal = newSnek.appleVal;
        //     value.gridSize = newSnek.gridSize;
        // }));
    }
    changeErrorText(text, callback = (() => null)){
        if(!this.state.errorText){
            this.setState((state) => ({errorText: text}), callback);
        }
        else if(this.state.errorText.length < text.length){
            this.setState((state) => ({errorText: text}), callback);
        }
        else{
            if(this.state.errorText === text){
                this.setState((state) => ({errorText: (text + " ")}), callback);
            }
            else{
                this.setState((state) => ({errorText: text}), callback);
            }
        }
    }
    loadFromString(str){
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        let snek = null;

        try {
            // console.log("try one");
            // console.log("success species");
            snek = new SnakeSpecies(Snake.parse(str));
        } catch (e) {

        }
        finally {
            // console.log("finally 1");
            try {
                // console.log("try two");
                // console.log("success snek");
                snek = SnakeSpecies.parse(str);
            } catch(e){

            }
            finally {
                // console.log("finally");
                if(snek) {
                    // console.log("saving");
                    // console.log(snek);
                    popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, snek);
                    popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
                    this.changeErrorText("Snake loaded successfully, opening...");
                    popUpFuncs.close();
                    // console.log(loadedSnakesIn);
                    // setTimeout(() => popUpFuncs.close(2, loadedSnakesIn.length - 1), 1);
                }
                else{
                    // console.log("invalid");
                    this.changeErrorText("Invalid Snake");
                }
            }
        }
    }
    componentDidMount() {
        this.updateSnake();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateSnake();
    }
}

// edit evolution popup
class EditEvolutionPopUp extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            evolution: null,
            currSnake: null,
            errorText: "(Nothing to Save.)",
            confirmationBox: false,
            quitConfirmation: false
        };

        this.saved = true;

        this.createBlank = this.createBlank.bind(this);
        this.saveResults = this.saveResults.bind(this);
        this.changeErrorText = this.changeErrorText.bind(this);
        this.changed = this.changed.bind(this);
    }
    render(){
        const {metaInfo: metaInfo, evolutionIn: evolutionIn} = this.props;
        const {evolution: evolution, currSnake: currSnake} = this.state;

        if(!evolution){
            return null;
        }

        const speed = typeWriteSpeed;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s)), changeEvolution(newEvolution)
        const popUpFuncs = this.props.popUpFuncs;

        let confirmation = null;
        if(this.state.confirmationBox){
            confirmation = (
                <div className={"confirmation_box"}>
                    <h3>Are you sure you want to override the previous parameters and evolution progress? The previous snakes will remain saved.</h3>
                    <div>
                        <Button onClick={() => this.setState(() => ({confirmationBox: false}))}>Cancel</Button>
                        <Button onClick={this.saveResults}>Yes, Override</Button>
                    </div>
                </div>
            );
        }
        let quitConfirmation = null;
        if(this.state.quitConfirmation){
            quitConfirmation = (
                <div className={"confirmation_box"}>
                    <h3>Are you sure you want to quit without saving?</h3>
                    <div>
                        <Button onClick={() => this.setState(() => ({quitConfirmation: false}))}>Cancel</Button>
                        <Button onClick={() => this.setState(() => ({quitConfirmation: false}), () => this.saveResults())}>No, Save</Button>
                        <Button onClick={() => popUpFuncs.close()}>Yes, Quit Without Saving</Button>
                    </div>
                </div>
            );
        }

        return (
            <PopUp className={"background create_snake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={() => {
                if(!this.saved) {
                    this.setState(() => ({quitConfirmation: true}))
                }
                else{
                    popUpFuncs.close();
                }
            }}>
                <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                    <span>{this.state.errorText}</span>
                </FadeDiv>
                <div className={"container"}>
                    {confirmation}
                    {quitConfirmation}
                    <div className={"text_card background"}>
                        <div className={"details"}>
                            {/*title + description*/}
                            <TextArea onChange={(val) => {
                                evolution.componentName = val;
                                this.changed();
                            }}>
                                <h1>{evolution.getComponentName()}</h1>
                            </TextArea>

                            <CollapsibleDiv startOpen={collapsePrefEvolution[0]} changePref={(val) => (collapsePrefEvolution[0] = val)}>
                                <p className={"category_text_title"}>Description</p>
                                <TextArea onChange={(val) => {
                                    evolution.componentDescription = val;
                                    this.changed();
                                }}>
                                    <p className={"category_text"}>{evolution.getComponentDescription()}</p>
                                </TextArea>
                            </CollapsibleDiv>

                            {/*parameters*/}
                            <CollapsibleDiv startOpen={collapsePrefEvolution[1]} changePref={(val) => (collapsePrefEvolution[1] = val)}>
                                <p className={"category_text_title"}>Parameters</p>
                                {evolution.parameters.map((val, index) => {
                                    const [name, defaultVal, desc, min, max, step] = defaultEvolutionParams[index];
                                    const htmlName = name.replace(" ", "_");
                                    if(index !== 1 && index !== 2){
                                        return(
                                            <Fragment>

                                                <div className={"wrapper_div inline_block_parent"}>
                                                    <label htmlFor={htmlName} className={"category_text_title small"}>{name}</label>
                                                    {((index !== 5) ? (
                                                        // all fields are numeric input except for 5
                                                        <NumberForm name={htmlName} initVal={val} min={min} max={max} step={step} onChange={(val) => {
                                                            evolution.parameters[index] = val;
                                                            this.changed();
                                                        }} />
                                                    ) : (
                                                        // special case for mode-normalization
                                                        <Select initVal={evolution.parameters[index]} name={htmlName} onSelect={(val) => {
                                                            evolution.parameters[index] = parseInt(val);
                                                            this.changed();
                                                        }}>
                                                            <option value={0}>Median</option>
                                                            <option value={1}>Mean</option>
                                                        </Select>
                                                    ))}
                                                </div>
                                                <TypewriterText speed={speed}>
                                                    <p className={"category_text"}>{desc}</p>
                                                </TypewriterText>
                                            </Fragment>
                                        );
                                    }
                                })}
                            </CollapsibleDiv>

                            {/*mutations | parameters[2]=[mutation, likelyhood]*/}
                            <CollapsibleDiv startOpen={collapsePrefEvolution[2]} changePref={(val) => (collapsePrefEvolution[2] = val)}>
                                <p className={"category_text_title"}>Mutation Methods</p>
                                {evolution.parameters[2].map((arr, mutationIndex) => {
                                    const [mutation, relativeProb] = arr;
                                    const htmlNameMutation = `mutation_${mutationIndex}`;
                                    return(
                                        <div className={"component_block"}>
                                            <div className={"wrapper_div inline_block_parent"}>
                                                <select className={"category_text_title small"} value={mutation.componentID} name={htmlNameMutation} onChange={(val) => {
                                                    val = val.target.value;
                                                    evolution.parameters[2].splice(mutationIndex, 1, [blankMutations[val].cloneMe(), 1]);
                                                    this.changed();
                                                }} >
                                                    {blankMutations.map((value, index) => (
                                                        <option value={index}>{value.getComponentName()}</option>
                                                    ))}
                                                </select>
                                                <div className={"wrapper_div inline_block_parent float_right"}>
                                                    <label htmlFor={htmlNameMutation + "_probability"}>Relative Likelihood: </label>
                                                    <NumberForm name={htmlNameMutation + "_probability"} initVal={relativeProb} min={1} max={100000} step={0.5} onChange={(val) => {
                                                        evolution.parameters[2][mutationIndex][1] = val;
                                                        this.changed();
                                                    }} />
                                                </div>
                                            </div>
                                            <TypewriterText speed={speed}>
                                                <p className={"category_text" + ((this.props.className) ? (" " + this.props.className) : (""))}>{mutation.getComponentDescription()}</p>
                                            </TypewriterText>
                                            {/*parameters*/}
                                            {mutation.mutationParameters.map((arr, paramIndex) => {
                                                const isSelect = arr.length === 4;
                                                let name, val, desc;

                                                let form = null;

                                                const htmlName = `parameter_${paramIndex}`;

                                                let min, max, step, options;
                                                if(!isSelect){
                                                    [name, val, desc, min, max, step] = arr;
                                                    form = (
                                                        <NumberForm name={htmlName} initVal={val} min={min} max={max} step={step} onChange={(val) => {
                                                            mutation.mutationParameters[paramIndex][1] = val;
                                                            this.changed();
                                                        }} />
                                                    );
                                                }
                                                else{
                                                    [name, val, desc, options] = arr;
                                                    form = (
                                                        <Select name={htmlName} initVal={val} onSelect={(val) => {
                                                            mutation.mutationParameters[paramIndex][1] = val;
                                                            this.changed();
                                                        }}>
                                                            {options.map((optionVal, optionIndex) => (
                                                                <option value={optionVal}>{optionVal + ""}</option>
                                                            ))}
                                                        </Select>
                                                    );
                                                }

                                                return(
                                                    <Fragment>
                                                        <div className={"inline_block_parent"}>
                                                            <label htmlFor={htmlName} className={"category_text_title small"}>{name}</label>
                                                            {form}
                                                        </div>
                                                        <p className={"category_text"}>{desc}</p>
                                                    </Fragment>
                                                );
                                            })}
                                            <div className={"button_div"}>
                                                {/*delete*/}
                                                {((evolution.parameters[2].length <= 1) ? (
                                                    <Button className={"faded" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={() => null}>
                                                        <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/delete-button-580x580.png"} />
                                                    </Button>
                                                ) : (
                                                    <Button className={this.props.className} onClick={() => {
                                                        evolution.parameters[2].splice(mutationIndex, 1);
                                                        this.changed();
                                                    }}>
                                                        <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/delete-button-580x580.png"} />
                                                    </Button>
                                                ))}
                                                {/*clone*/}
                                                <Button className={this.props.className} onClick={() => {
                                                    evolution.parameters[2].push([mutation.cloneMe(), relativeProb]);
                                                    this.changed();
                                                }}>
                                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/+-button-640x640.png"} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className={"inline_block_parent inline_buttons edit_add_component"}>
                                    <label htmlFor={"mutation_extra"}>Add Mutation:</label>
                                    <select value={-1} name={`mutation_extra`} onChange={(val) => {
                                        val = val.target.value;
                                        evolution.parameters[2].push([blankMutations[val].cloneMe(), 1]);
                                        this.changed();
                                    }} >
                                        <option value={-1}>------</option>
                                        {blankMutations.map((value, index) => (
                                            <option value={index}>{value.getComponentName()}</option>
                                        ))}
                                    </select>
                                </div>
                            </CollapsibleDiv>

                            {/*reproductions | parameters[1]=[reproduction, likelyhood]*/}
                            <CollapsibleDiv startOpen={collapsePrefEvolution[3]} changePref={(val) => (collapsePrefEvolution[3] = val)}>
                                <p className={"category_text_title"}>Reproduction Methods</p>
                                {evolution.parameters[1].map((arr, reproductionIndex) => {
                                    const [reproduction, relativeProb] = arr;
                                    const htmlNameReproduction = `reproduction_${reproductionIndex}`;
                                    return(
                                        <div className={"component_block"}>
                                            <div className={"wrapper_div inline_block_parent"}>
                                                <select className={"category_text_title small"} value={reproduction.componentID} name={htmlNameReproduction} onChange={(val) => {
                                                    val = val.target.value;
                                                    evolution.parameters[1].splice(reproductionIndex, 1, [blankReproductions[val].cloneMe(), 1]);
                                                    this.changed();
                                                }} >
                                                    {blankReproductions.map((value, index) => (
                                                        <option value={index}>{value.getComponentName()}</option>
                                                    ))}
                                                </select>
                                                <div className={"wrapper_div inline_block_parent float_right"}>
                                                    <label htmlFor={htmlNameReproduction + "_probability"}>Relative Likelihood: </label>
                                                    <NumberForm name={htmlNameReproduction + "_probability"} initVal={relativeProb} min={1} max={100000} step={0.5} onChange={(val) => {
                                                        evolution.parameters[1][reproductionIndex][1] = val;
                                                        this.changed();
                                                    }} />
                                                </div>
                                            </div>
                                            <TypewriterText speed={speed}>
                                                <p className={"category_text" + ((this.props.className) ? (" " + this.props.className) : (""))}>{reproduction.getComponentDescription()}</p>
                                            </TypewriterText>
                                            {/*parameters*/}
                                            {reproduction.reproductionParameters.map((arr, paramIndex) => {
                                                const isSelect = (arr.length === 4);
                                                let name, val, desc;

                                                let form = null;

                                                const htmlName = `parameter_${paramIndex}`;

                                                let min, max, step, options;
                                                if(!isSelect){
                                                    [name, val, desc, min, max, step] = arr;
                                                    form = (
                                                        <NumberForm name={htmlName} initVal={val} min={min} max={max} step={step} onChange={(val) => {
                                                            reproduction.reproductionParameters[paramIndex][1] = val;
                                                            this.changed();
                                                        }} />
                                                    );
                                                }
                                                else{
                                                    [name, val, desc, options] = arr;
                                                    form = (
                                                        <Select name={htmlName} initVal={val} onSelect={(val) => {
                                                            reproduction.reproductionParameters[paramIndex][1] = val;
                                                            this.changed();
                                                        }}>
                                                            {options.map((optionVal, optionIndex) => (
                                                                <option value={optionVal}>{optionVal + ""}</option>
                                                            ))}
                                                        </Select>
                                                    );
                                                }

                                                return(
                                                    <Fragment>
                                                        <div className={"inline_block_parent"}>
                                                            <label htmlFor={htmlName} className={"category_text_title small"}>{name}</label>
                                                            {form}
                                                        </div>
                                                        <p className={"category_text"}>{desc}</p>
                                                    </Fragment>
                                                );
                                            })}
                                            <div className={"button_div"}>
                                                {/*delete*/}
                                                {((evolution.parameters[1].length <= 1) ? (
                                                    <Button className={"faded" + ((this.props.className) ? (" " + this.props.className) : (""))} onClick={() => null}>
                                                        <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/delete-button-580x580.png"} />
                                                    </Button>
                                                ) : (
                                                    <Button className={this.props.className} onClick={() => {
                                                        evolution.parameters[1].splice(reproductionIndex, 1);
                                                        this.changed();
                                                    }}>
                                                        <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/delete-button-580x580.png"} />
                                                    </Button>
                                                ))}
                                                {/*clone*/}
                                                <Button className={this.props.className} onClick={() => {
                                                    evolution.parameters[1].push([reproduction.cloneMe(), relativeProb]);
                                                    this.changed();
                                                }}>
                                                    <ImgIcon className={"wrapper_div"} small={3} src={"src/Images/+-button-640x640.png"} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className={"inline_block_parent inline_buttons edit_add_component"}>
                                    <label htmlFor={"reproduction_extra"}>Add Reproduction:</label>
                                    <select value={-1} name={`reproduction_extra`} onChange={(val) => {
                                        val = val.target.value;
                                        evolution.parameters[1].push([blankReproductions[val].cloneMe(), 1]);
                                        this.changed();
                                    }} >
                                        <option value={-1}>------</option>
                                        {blankReproductions.map((value, index) => (
                                            <option value={index}>{value.getComponentName()}</option>
                                        ))}
                                    </select>
                                </div>
                            </CollapsibleDiv>

                            {/*snake*/}
                            <CollapsibleDiv startOpen={collapsePrefEvolution[4]} changePref={(val) => (collapsePrefEvolution[4] = val)}>
                                <div className={"inline_block_parent"}>
                                    <label className={"category_text_title"} htmlFor={"snake_select"}>Snake</label>
                                    <Select initVal={-1} name={"snake_select"} onSelect={(val) => {
                                        val = parseInt(val);
                                        if(val !== -1){
                                            this.setState(() => ({currSnake: loadedSnakes[val].cloneMe()}));
                                            this.changed();
                                        }
                                    }}>
                                        <option value={-1}>{((currSnake) ? (currSnake.getComponentName()) : ("---"))}</option>
                                        {loadedSnakes.map((snek, index) => {
                                            snek = snek.snakes[0];
                                            if(evolutionBrains.includes(snek.myBrain.componentID)) {
                                                return (
                                                    <option value={index}>{snek.getComponentName()}</option>
                                                );
                                            }
                                            else{
                                                return null;
                                            }
                                        })}
                                    </Select>
                                </div>
                                <h4>(Snakes Must Have One Of The Following Brains:{" "}
                                    {((blankBrains.filter(((value, index) => {
                                        return evolutionBrains.includes(value.componentID);
                                    }))).map((value, index) => {
                                        return `"${value.getComponentName()}${((index === evolutionBrains.length-1) ? (".") : (","))}"`;
                                    })).join(" ")})</h4>
                                {((currSnake) ? (
                                    <SnakeDetails snake={currSnake} />
                                ) : null)}
                            </CollapsibleDiv>
                        </div>
                        <div className={"button_div"}>
                            <Button onClick={this.saveResults}>Save</Button>
                        </div>
                    </div>
                </div>
            </PopUp>
        );
    }
    createBlank(){
        if(this.props.metaInfo instanceof Snake){
            this.setState((state) => ({evolution: new Evolution(this.props.metaInfo)}));
        }
        else{
            this.setState((state) => ({evolution: new Evolution(null)}));
        }
    }
    saveResults(){
        if(!this.saved) {
            if (this.state.confirmationBox) {
                // save
                this.setState(() => ({confirmationBox: false}));
                let ans = this.state.evolution.cloneMe();
                ans.currentGeneration = [[this.state.currSnake.cloneMe(), 1]];
                this.props.popUpFuncs.changeEvolution(ans);
                this.saved = true;
                this.changeErrorText("(Saved Successfully.)");
            } else {
                this.setState(() => ({confirmationBox: true}));
            }
        }
        else{
            this.changeErrorText("(Nothing to Save.)");
        }
    }
    changeErrorText(text, callback = (() => null)){
        if(!this.state.errorText){
            this.setState((state) => ({errorText: text}), callback);
        }
        else if(this.state.errorText.length < text.length){
            this.setState((state) => ({errorText: text}), callback);
        }
        else{
            if(this.state.errorText === text){
                this.setState((state) => ({errorText: (text + " ")}), callback);
            }
            else{
                this.setState((state) => ({errorText: text}), callback);
            }
        }
    }
    changed(){
        this.saved = false;
        this.forceUpdate();
    }
    componentDidMount() {
        if(!this.state.evolution){
            this.setState(() => ({evolution: this.props.evolutionIn.cloneMe()}), () => {
                if(this.state.evolution.currentGeneration && this.state.evolution.currentGeneration[0] && this.state.evolution.currentGeneration[0][0] instanceof Snake){
                    this.setState(() => ({currSnake: this.state.evolution.currentGeneration[0][0].cloneMe()}));
                }
            });
        }
    }
}