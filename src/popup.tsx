import React from "react"
import ReactDOM from "react-dom"

/*** Styling ****/
import "./popup.scss"
import {createMuiTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { MESSAGE } from "./extension/config";
import { Settings } from "./models/Settings";
import App from './components/App';

// Localisation: https://developer.chrome.com/docs/extensions/reference/in/
// Mutli-tab support?

function Popup(extSettings: Settings) {
    // We use this wrapper because we 
    // need to enclose hooks like .useMemo() inside a function component
    
    // Determine if the users has dark or light mode specified in their browser/OS
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        // Theming: 
        //  https://material-ui.com/customization/palette/
        //  https://material-ui.com/components/css-baseline/
        () =>
          createMuiTheme({
                palette: {
                    type: prefersDarkMode ? 'dark' : 'light',
                    primary: { main: "#bb92ac"}
                },
                typography: {
                    fontSize: 12,
                } 
          }),
        [prefersDarkMode]
    );
    
    // The app recieves the theme and the extension settings as
    // props during its creation
    return <App {...extSettings} theme={theme}/>
}

chrome.runtime.sendMessage( {action: MESSAGE.getSettings}, (extSettings: Settings) => {
    
    // Render the popup in the response handler of the action which fetches
    // the extension settings
    ReactDOM.render(
        <Popup {...extSettings} />, 
        document.querySelector('#app')
    )
});
