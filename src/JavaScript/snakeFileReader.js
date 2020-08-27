// reads all snakes in a given text document
function loadSnakesFromFile(name) {
    let url = new URL(`./src/SavedSnakes/${name}.txt`, "https://eelyort.github.io/shrewdSnek2/");
    fetch(url.toString()).then((result) => result.blob()).then((blob) => {
        let reader = new FileReader();
        reader.onload = (event) => {
            let result = event.target.result.split("\n").filter(val => val.length > 0);
            let snakes = result.map(((value, index) => Snake.parse(value)));

            loadedSnakes.push(new SnakeSpecies(snakes));
        };

        reader.readAsText(blob);
    });
}