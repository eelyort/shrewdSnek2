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
            <PopUp className={"background selectSnake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={popUpFuncs.close}>
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
                            <label htmlFor={"generation_number"} className={"generation_label"}>Generation: </label>
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
    changeErrorText(text){
        if(!this.state.errorText){
            this.setState((state) => ({errorText: text}));
        }
        else if(this.state.errorText.length < text.length){
            this.setState((state) => ({errorText: text}));
        }
        else{
            if(this.state.errorText === text){
                this.setState((state) => ({errorText: (text + " ")}));
            }
            else{
                this.setState((state) => ({errorText: text}));
            }
        }
    }
}

// popup to create/edit a snake - 2
class CreateSnakePopUpREACT extends React.Component{
    constructor(props){
        super(props);

        this.state={
            snake: null
        };

        this.updateSnake = this.updateSnake.bind(this);
        this.createBlankSnake = this.createBlankSnake.bind(this);
        this.saveResults = this.saveResults.bind(this);
    }
    render() {
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), spliceLoaded(start, toDelete, newSnake(s))
        const popUpFuncs = this.props.popUpFuncs;

        // nothing to display
        if(!this.state.snake){
            return (
                <PopUp className={"background create_snake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={popUpFuncs.close}>
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
                            </div>
                        </div>
                    </div>
                </PopUp>
            );
        }

        return (
            <PopUp className={"background create_snake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={popUpFuncs.close}>
                <div>
                    <div className={"text_card background"}>
                        <SnakeDetailsEdit snake={this.state.snake}/>
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
        // TODO
    }
    componentDidMount() {
        this.updateSnake();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateSnake();
    }
}