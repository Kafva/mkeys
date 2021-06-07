import React from "react";
import { AppProps, AppState } from "../types";
export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps);
    handleFeatureToggle(key: string, value: boolean | string): void;
    handleNumericUpdate(newMinutes: number): void;
    closeSnackBar(): void;
    render(): JSX.Element;
}
