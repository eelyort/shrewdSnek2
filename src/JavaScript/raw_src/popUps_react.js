// popup to select a loaded snake
class SelectSnakePopUpREACT extends React.Component{
    constructor(props){
        super(props);
    }
    render() {
        const {selectedSnake: selectedSnake, selectedSnakeGen: selectedSnakeGen, loadedSnakesIn: loadedSnakesIn} = this.props;

        // bundle of functions for the popup to interact with the main menu
        //  close(newPopUp = null),  changeSelected(newI),  changeSelectedGen(newI),  changeLoaded(newLoadedSnakes)
        const popUpFuncs = this.props.popUpFuncs;

        console.log(`render: selectedGen: ${selectedSnakeGen}`);

        return (
            <PopUp className={"background selectSnake" + ((this.props.className) ? (" " + this.props.className) : (""))} closePopUp={popUpFuncs.close}>
                <div>
                    <div className={"carousel_parent"}>
                        <VerticalCarousel selected={selectedSnake} items={loadedSnakesIn} select={popUpFuncs.changeSelected}>
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
                                <option value={2}>2</option>
                            </Select>
                        </div>
                        <SnakeDetails snake={loadedSnakesIn[selectedSnake].snakes[selectedSnakeGen]} />
                    </div>
                </div>
            </PopUp>
        );
    }
}