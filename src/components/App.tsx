import React from "react" 

/****** Styling *********/
// The CssBaseline component is needed to apply theme settings globally,
// without it the background of the <body> will not be updated
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider, Theme} from '@material-ui/core/styles';

/***** Icons *******/
import AvTimerIcon from '@material-ui/icons/AvTimer';

/****** Components *********/
import FeatureSwitch from './FeatureSwitch';
import NumericField from './NumericField';
import List from '@material-ui/core/List';
import { CONTENT_MESSAGE, DEFAULT_SKIP_MINUTES, STORAGE_KEYS } from "../extension/config";
import { Settings } from "../models/Settings";
import { chromeMessageErrorOccured } from "../util/helper";
import AppItem from "./AppItem";

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
    // timeskip feature in the App rather than inside the NumericField/Switches
    
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
        this.handleNumericUpdate  = this.handleNumericUpdate.bind(this);
    }

    handleFeatureToggle(key: string, value:any) {
        // We need to send a message to the
        // content-script to run any function that interacts with the
        // actual page in the browser
        
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            // We can send a message to every returned tab, all tabs where an
            // instance of the content-script is running will be updated
            for (let tab of tabs){
                chrome.tabs.sendMessage(tab?.id,  {
                    action: CONTENT_MESSAGE.featureToggle, 
                    key: key, 
                    value: value 
                }, (res) => {
                    chromeMessageErrorOccured(CONTENT_MESSAGE.featureToggle, res);
                });
            }
        });
        
        // Update the state (and implicitly the UI) of the extension page
        this.setState( (state) => ({ [key]: value } as Settings) ) 
    }
    
    handleNumericUpdate(newMinutes: number) {
        
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            for (let tab of tabs){
                chrome.tabs.sendMessage(tab?.id,  {
                    action: CONTENT_MESSAGE.setSkipValue, 
                    value: newMinutes 
                }, (res) => {
                    chromeMessageErrorOccured(CONTENT_MESSAGE.setSkipValue, res);
                });
            }
        });
        
        // Always update the UI so that the error and help text can be displayed
        this.setState( () => ({minutesToSkip: newMinutes || DEFAULT_SKIP_MINUTES} as Settings) )
    }

    render(){
        // Localisation: https://developer.chrome.com/docs/extensions/reference/in/
        return <ThemeProvider theme={this.props.theme}>
        <CssBaseline>
            <List>
            <AppItem icon={AvTimerIcon}>
                <NumericField 
                    text={ chrome.i18n.getMessage("minutesToSkip") }  
                    disabled={!this.state.timeSkipEnabled}
                    minutes={this.state.minutesToSkip}
                    handleChange={this.handleNumericUpdate}
                />
                
                <FeatureSwitch 
                    storageKey={STORAGE_KEYS.timeSkipEnabled}
                    on={this.state.timeSkipEnabled}
                    handleChange={this.handleFeatureToggle}
                />
            </AppItem>
            </List>
        </CssBaseline>
        </ThemeProvider>
    }

}

