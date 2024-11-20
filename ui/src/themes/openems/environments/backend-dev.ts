import { Environment } from "src/environments";
import { theme } from "./theme";

export const environment: Environment = {
    ...theme, ...{

        backend: 'OpenEMS Backend',
        url: "ws://178.18.248.196:8082",

        production: false,
        debugMode: true
    }
};