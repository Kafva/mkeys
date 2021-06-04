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
import TimerIcon from '@material-ui/icons/Timer';

/****** Components *********/
import FeatureSwitch from './components/FeatureSwitch';
import List from '@material-ui/core/List';

function App(){
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
            <FeatureSwitch text="feature 1" icon={TimerIcon} />
            <FeatureSwitch text="feature 2"/>
            <FeatureSwitch text="feature 3"/>
        </List>
    </CssBaseline>
    </ThemeProvider>
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)