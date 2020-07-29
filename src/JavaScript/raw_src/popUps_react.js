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

        return (
            <PopUp className={"background selectSnake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={() => popUpFuncs.close()}>
                <div>
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
                                        <option value={index}>{index}</option>
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
                            <Button onClick={this.saveButton}>Save</Button>
                        </div>
                        <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                            {this.state.errorText}
                        </FadeDiv>
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

        let snek = this.props.loadedSnakesIn[this.props.selectedSnake].snakes[this.props.selectedSnakeGen].cloneMe();
        snek.setNameClone();

        popUpFuncs.spliceLoaded(this.props.loadedSnakesIn.length, 0, snek);
        popUpFuncs.changeSelected(this.props.loadedSnakesIn.length-1);
    }
    saveButton(){
        const {metaInfo: metaInfo, selectedSnake: selectedSnake, selectedSnakeGen: selectedSnakeGen, loadedSnakesIn: loadedSnakesIn} = this.props;

        console.log("todo save button - generation");

        // save a snakeSpecies
        // create a text area with the snake
        const el = document.createElement('textarea');
        el.value = loadedSnakesIn[selectedSnake].stringify();
        document.body.appendChild(el);
        // select it
        el.select();
        el.setSelectionRange(0, 99999); /*For mobile devices*/
        // copy
        document.execCommand("copy");
        // remove
        document.body.removeChild(el);

        this.changeErrorText("(Snake(s) copied to clipboard)");
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

        this.saved=false;

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
        this.changeErrorText = this.changeErrorText.bind(this);
    }
    render() {
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        // nothing to display
        if(!this.state.snake){
            return (
                <PopUp className={"background create_snake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={() => popUpFuncs.close()}>
                    <div>
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
                                <TextArea onChange={(val) => {
                                    try {
                                        const snek = SnakeSpecies.parse(val);
                                        popUpFuncs.spliceLoaded(loadedSnakesIn.length, 1, snek);
                                        popUpFuncs.changeSelected(loadedSnakesIn.length-1);
                                        this.changeErrorText("Snake loaded successfully, opening...");
                                        popUpFuncs.close();
                                        setTimeout(() => popUpFuncs.close(2, loadedSnakesIn.length-1), 1);
                                    }
                                    catch (e) {
                                        this.changeErrorText("Invalid snake");
                                    }
                                }}>
                                    <p className={"paste_saved"} />
                                </TextArea>
                                <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                                    {this.state.errorText}
                                </FadeDiv>
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
                    <h3>Are you sure you want to override the previous version of this snake?{((loadedSnakesIn[metaInfo].getLength() > 1) ? (" All generations will also be erased.") : (""))}</h3>
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
                if(!this.saved) {
                    this.setState(() => ({quitConfirmation: true}))
                }
                else{
                    popUpFuncs.close();
                }
            }}>
                <div>
                    {confirmation}
                    {quitConfirmation}
                    <div className={"text_card background"}>
                        <SnakeDetailsEdit snake={this.state.snake} tellChange={() => {
                            console.log("unsave");
                            if(this.saved){
                                this.saved = false;
                            }
                        }}/>
                        <div className={"button_div"}>
                            <Button onClick={this.saveResults}>Save</Button>
                        </div>
                        <FadeDiv speed={.75} className={"error_text"} shouldReset={true}>
                            {this.state.errorText}
                        </FadeDiv>
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

        // TODO: snake validation

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        // replace an existing snake
        if(metaInfo != null){
            if(this.state.confirmationBox) {
                this.setState(() => ({confirmationBox: false}), () => {
                    popUpFuncs.spliceLoaded(metaInfo, 1, this.state.snake);
                    popUpFuncs.changeSelected(metaInfo);
                    this.changeErrorText("(Save Successful)", () => {
                        this.saved = true;
                        console.log("saved");
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

        // TODO: snake validation

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        this.state.snake.setNameClone();
        this.setState((state) => ({
            snake: state.snake.cloneMe()
        }), () => {
            popUpFuncs.spliceLoaded(loadedSnakesIn.length, 0, this.state.snake.cloneMe());
            popUpFuncs.changeSelected(loadedSnakesIn.length - 1);
            popUpFuncs.close(1);
            // setTimeout(() => {
            //     this.saved=true;
            //     console.log("saved");
            // }, 1);
        });
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
    componentDidMount() {
        this.updateSnake();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateSnake();
    }
}