// popup to select a loaded snake - 1
class SelectSnakePopUpREACT extends React.Component{
    constructor(props){
        super(props);

        this.state={errorText: ""};

        this.editButton = this.editButton.bind(this);
        this.cloneButton = this.cloneButton.bind(this);
    }
    render() {
        const {metaInfo: metaInfo, selectedSnake: selectedSnake, selectedSnakeGen: selectedSnakeGen, loadedSnakesIn: loadedSnakesIn} = this.props;

        const editable = !(selectedSnake < protectedSnakes);

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
        const popUpFuncs = this.props.popUpFuncs;

        // console.log(`render: selectedGen: ${selectedSnakeGen}`);

        return (
            <PopUp className={"background selectSnake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={popUpFuncs.close}>
                <div>
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
                                <Button onClick={this.editButton}>Edit</Button>
                            ) : (
                                <Button onClick={() => {
                                    this.setState((state) => ({errorText: ((state.errorText) ? (state.errorText + " ") : ("(Snake cannot be edited, try cloning then editing instead.)"))}))
                                }} className={"faded"}>Edit</Button>
                            ))}
                            <Button onClick={this.cloneButton}>Clone</Button>
                            <Button onClick={popUpFuncs.close}>Finish</Button>
                        </div>
                        <FadeDiv speed={.5} className={"error_text"} shouldReset={true}>
                            {this.state.errorText}
                        </FadeDiv>
                    </div>
                </div>
            </PopUp>
        );
    }
    editButton(){
        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
        const popUpFuncs = this.props.popUpFuncs;

        popUpFuncs.close(2, this.props.selectedSnake);
    }
    cloneButton(){
        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
        const popUpFuncs = this.props.popUpFuncs;

        let snek = this.props.loadedSnakesIn[this.props.selectedSnake].snakes[this.props.selectedSnakeGen].cloneMe();
        snek.setNameClone();

        popUpFuncs.pushLoaded(snek);
        popUpFuncs.changeSelected(this.props.loadedSnakesIn.length-1);
    }
}

// popup to create/edit a snake - 2
class CreateSnakePopUpREACT extends React.Component{
    constructor(props){
        super(props);

        this.state={
            snake: null
        };
    }
    render() {
        const {metaInfo: metaInfo, loadedSnakesIn: loadedSnakesIn} = this.props;

        const editable = !(selectedSnake < protectedSnakes);

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null, info = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes), pushLoaded(newSnake)
        const popUpFuncs = this.props.popUpFuncs;

        // console.log(`render: selectedGen: ${selectedSnakeGen}`);

        return (
            <PopUp className={"background selectSnake" + ((this.props.className) ? (" " + this.props.className) : (""))} closeFunc={popUpFuncs.close}>
                <div>
                    <div className={"text_card background"}>
                    </div>
                </div>
            </PopUp>
        );
    }
}