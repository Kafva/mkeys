import React from "react"
import ReactDOM from "react-dom"

import { chromeMessageErrorOccured } from "./util/helper";
import { CONTENT_MESSAGE, BKG_MESSAGE } from "./extension/config";
import { Settings } from "./models/Settings";
import App from './components/App';

/*** Styling ****/
import "./popup.scss"
import {createMuiTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
    
    // The app receives the theme and the extension settings as
    // props during its creation
    return <App {...extSettings} theme={theme}/>
}

// The "matches" key of the content-script in the manifest doesn't automatically
// grey out the extension on domains where it shouldn't run, it simply disables
// the content script from running. There probably is a way of greying out the
// extension automatically but for now I disable it manually when the popup is
// clicked on at sites where it should not not run 

chrome.tabs.query( {currentWindow: true, active: true}, (tabs) => {
    // The 'active' parameter ensures that we only receive the current tab
    // in the response
    // The "tabs" permission is needed to read the url etc. of tabs
    if (tabs.length > 0) {
        
        chrome.tabs.sendMessage(tabs[0].id,  {action: CONTENT_MESSAGE.ping}, (res) => {
            // Ping the content script and only render the popup if the
            // content script on the current page responds  
            // (i.e. if we are on of the pages defined for the
            // matches in the manifest.json)
            
            if (chromeMessageErrorOccured(CONTENT_MESSAGE.ping, res) || res?.success == false){
                // The .disable() action will grey out the badge for the extension
                chrome.action.disable(tabs[0].id); 
                window.close();
            }
            else {
                chrome.runtime.sendMessage( {action: BKG_MESSAGE.getSettings}, (extSettings: Settings) => {
                    // Render the popup in the response handler of the action which fetches
                    // the extension settings
                    if (!chromeMessageErrorOccured(BKG_MESSAGE.getSettings, extSettings)){
                         
                        ReactDOM.render(
                            <Popup {...extSettings} />, 
                            document.querySelector('#app')
                        )
                    }
                });
            }
        })
    }
    else { document.write("Could not read tabs"); }
});
