// function to read in snakes from a file

// TODO: delete test
// console.log(new URL("./relative-paths-in-javascript-in-an-external-file", "https://stackoverflow.com/questions/2188218/"));

let url = new URL("./src/SavedSnakes/evolution_4.txt", "https://eelyort.github.io/shrewdSnek2/");
// console.log(url.content);

fetch(url.toString()).then((result) => result.blob()).then((blob) => {
    console.log(blob);
});