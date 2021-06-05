import React from "react" 

/****** Styling *********/
// The CssBaseline component is needed to apply theme settings globally,
// without it the background of the <body> will not be updated
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider, Theme} from '@material-ui/core/styles';

/***** Icons *******/
import TimerIcon from '@material-ui/icons/Timer';
import AvTimerIcon from '@material-ui/icons/AvTimer';

/****** Components *********/
import FeatureSwitch from './FeatureSwitch';
import FeatureSlider from './FeatureSlider';
import List from '@material-ui/core/List';
import { DEBUG, DEFAULT_SKIP_MINUTES, MESSAGE, STORAGE_KEYS } from "../extension/config";
import { Settings } from "../models/Settings";
import { setSkipMinutes, setupTimeSkip } from "../util/timeskip";
import { validateMinutes } from "../util/validation";

interface AppProps extends Settings {
    // The application will take all attributes from
    // Settings along with the theme as props 
    // The 'state' will only reflect the Settings though
    theme: Theme
}


export default class App extends React.Component<AppProps,Settings> {

    // Hooks: https://reactjs.org/docs/hooks-state.html
    // React promotes a design where the state is maintained above all components
    // which depend on the state, these components can then be redrawn with new props
    // when the state changes
    //  https://reactjs.org/docs/thinking-in-react.html
    // Therefore we maintain the 'minutes to skip' and 'toggle status' of the
    // timeskip feature in the App rather than inside the Sliders/Switches
    
    constructor(props: AppProps) {
        super(props);
        // Inital values for the state based on the props
        this.state = {
            timeSkipEnabled: props.timeSkipEnabled || false,
            minutesToSkip: props.minutesToSkip || DEFAULT_SKIP_MINUTES
        }
        
        // This binding is necessary to make `this` work in the callback
        // of child components
        this.handleFeatureToggle = this.handleFeatureToggle.bind(this);
        this.handleSliderUpdate  = this.handleSliderUpdate.bind(this);
    }

    handleFeatureToggle(key: string, value:any) {
                    // ************* TODO we need to send a message to the
                    // content script to run any function that interacts wiith tthe page!!!!!!
                    // *******

        // Update the back-end settings in the extension
        chrome.runtime.sendMessage({
            action: MESSAGE.setSettings, 
            key: key, 
            value: value 
        }, (response) => {
            DEBUG && console.log(`(${MESSAGE.setSettings}) Feature toggle response:`, response);
            
            switch (key){
                case STORAGE_KEYS.timeSkipEnabled:
                    // Setup the timeskip feature if the
                    // newoState was the 'active' state
                    value && setupTimeSkip();
                    break;
            }
        });

        // Update the state (and implicitly the UI)
        this.setState( (state) => ({ [key]: value } as Settings) ) 
    }
    
    handleSliderUpdate(newMinutes: number) {
        // Only update the settings if the value passes validation
        validateMinutes(newMinutes) && 
            setSkipMinutes(newMinutes)

        // Always update the UI so that the error and help text can be displayed
        this.setState( () => ({minutesToSkip: newMinutes || DEFAULT_SKIP_MINUTES} as Settings) )
    }

    render(){
        return <ThemeProvider theme={this.props.theme}>
        <CssBaseline>
            <List>
                <FeatureSwitch 
                    storageKey={STORAGE_KEYS.timeSkipEnabled}
                    text={ chrome.i18n.getMessage("toggleTimeSkip") } 
                    icon={AvTimerIcon}
                    on={this.state.timeSkipEnabled}
                    handleChange={this.handleFeatureToggle}
                />
                <FeatureSlider 
                    text={ chrome.i18n.getMessage("minutesToSkip") }  
                    disabled={!this.state.timeSkipEnabled}
                    minutes={this.state.minutesToSkip}
                    handleChange={this.handleSliderUpdate}
                />
            </List>
        </CssBaseline>
        </ThemeProvider>
    }

}

