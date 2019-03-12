import { App } from "./src/app";

const app = new App();

app.start().then(() => {
    console.log("Async Loading Complete");
});
