// Mutli-tab support?

// Localisation: https://developer.chrome.com/docs/extensions/reference/in/

import React from "react"        // The core features of React
import ReactDOM from "react-dom" // Mainly used to mount the root components

/****** Styling *********/
// The CssBaseline component is needed to apply theme settings globally,
// without it the background of the <body> will not be updated
import CssBaseline from '@material-ui/core/CssBaseline';

import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import "./scss/main.scss"

/***** Icons *******/
import TimerIcon from '@material-ui/icons/Timer';
import AvTimerIcon from '@material-ui/icons/AvTimer';

/****** Components *********/
import FeatureSwitch from './components/FeatureSwitch';
import FeatureSlider from './components/FeatureSlider';
import List from '@material-ui/core/List';
import { MESSAGE } from "./app/config";
import { Settings } from "./models/Settings";

function App (extSettings: Settings) {
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
    

    return <ThemeProvider theme={theme}>
    <CssBaseline>
        <List>
            <FeatureSwitch 
                text="Toggle time skip" 
                icon={TimerIcon} 
                initialOnValue={extSettings.timeSkipEnabled} 
            />
            <FeatureSlider 
                text="Minutes to skip"  
                icon={AvTimerIcon}
                initialSkipMinutes={extSettings.secondsToSkip/60}
            />
        </List>
    </CssBaseline>
    </ThemeProvider>
}

chrome.runtime.sendMessage( {action: MESSAGE.getSettings}, (extSettings: Settings) => {
    
    // Pass the attributes of the extension settings to the application component
    ReactDOM.render(
        <App {...extSettings}/>,
        document.querySelector('#app')
    )
});
