import { App } from "./src/app";

const app = new App();

app.start().then(() => {
    console.log("App load complete");
});
