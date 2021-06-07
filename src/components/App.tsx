import React from "react" 

/****** Styling *********/
// The CssBaseline component is needed to apply theme settings globally,
// without it the background of the <body> will not be updated
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles';

/***** Icons *******/
import AvTimerIcon from '@material-ui/icons/AvTimer';

/****** Components *********/
import Snackbar from '@material-ui/core/Snackbar';
import FeatureSwitch from './FeatureSwitch';
import NumericField from './NumericField';
import List from '@material-ui/core/List';
import { Config } from "../extension/config";
import { Settings, AppProps, AppState, CONTENT_MESSAGE, STORAGE_KEYS } from "../types";
import { chromeMessageErrorOccured } from "../util/helper";
import AppItem from "./AppItem";
import { IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';



export default class App extends React.Component<AppProps,AppState> {

    // Hooks: https://reactjs.org/docs/hooks-state.html
    // React promotes a design where the state is maintained above all components
    // which depend on the state, these components can then be redrawn with new props
    // when the state changes
    //  https://reactjs.org/docs/thinking-in-react.html
    // We therefore maintain the 'minutes to skip' and 'toggle status' of the
    // timeskip feature in the 'App' rather than inside the NumericField/Switch
    
    constructor(props: AppProps) {
        super(props);
        // Initial values for the state based on the props
        this.state = {
            timeSkipEnabled: props.timeSkipEnabled || false,
            minutesToSkip: props.minutesToSkip || Config.DEFAULT_SKIP_MINUTES,
            showSnackbar: false
        }
        
        // This binding is necessary to make `this` work in the callback
        // of child components
        this.handleFeatureToggle = this.handleFeatureToggle.bind(this);
        this.handleNumericUpdate  = this.handleNumericUpdate.bind(this);
    }

    handleFeatureToggle(key: string, value: boolean|string): void {
        // We need to send a message to the
        // content-script to run any function that interacts with the
        // actual page in the browser
        
        chrome.tabs.query({currentWindow: true}, (tabs) => {
            // We send a message to every returned tab (not just the currently active
            // one), all tabs where an instance of the content-script is running 
            // will thus be updated. This means that we do NOT need to maintain different
            // states for the feature toggle per tab
            tabs.forEach( (tab) => {
                tab?.id != null &&
                chrome.tabs.sendMessage(tab.id,  {
                    action: CONTENT_MESSAGE.featureToggle, 
                    key: key, 
                    value: value 
                }, (res) => {
                    chromeMessageErrorOccured(CONTENT_MESSAGE.featureToggle, res);
                });
            })
        });
        
        // Update the state (and implicitly the UI) of the extension page
        this.setState( () => ({ [key]: value } as unknown as AppState) );

        if (!value){
            // Update the snackbar to notify the user if the feature was disabled
            document.body.style.setProperty("height", "170px");
            this.setState( () => ({ "showSnackbar": true }) );
        }
    }
    
    handleNumericUpdate(newMinutes: number): void {
        
        chrome.tabs.query({currentWindow: true }, (tabs) => {
            tabs.forEach( (tab) => {
                // Send an update signal to every tab
                tab?.id != null &&
                chrome.tabs.sendMessage(tab.id,  {
                    action: CONTENT_MESSAGE.setSkipValue, 
                    value: newMinutes 
                }, (res) => {
                    chromeMessageErrorOccured(CONTENT_MESSAGE.setSkipValue, res);
                });
            });
        });
        
        // Always update the UI so that the error and help text can be displayed
        this.setState( () => ({minutesToSkip: newMinutes || Config.DEFAULT_SKIP_MINUTES} as Settings) )
    }

    closeSnackBar(): void {
        this.setState( () => ({ "showSnackbar": false }) )        
        document.body.style.setProperty("height", ""); // Default back to `min-size`
    }

    render(): JSX.Element {
        // Localisation: https://developer.chrome.com/docs/extensions/reference/in/
        return <ThemeProvider theme={this.props.theme}>
        <CssBaseline>
            <List>
            <AppItem icon={AvTimerIcon}>
                <NumericField 
                    text={chrome.i18n.getMessage("minutesToSkip")}  
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
            <Snackbar
                message={chrome.i18n.getMessage("reload")}
                open={this.state.showSnackbar}
                onClose={ () => this.closeSnackBar() }
                autoHideDuration={Config.AUTO_HIDE_SNACKBAR_SEC*1000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                action={
                    <IconButton 
                        size="small" aria-label="close" color="inherit" 
                        onClick={ () => this.closeSnackBar() }
                    >
                        <CloseIcon fontSize="small"/>
                    </IconButton>
                }
            />
        </CssBaseline>
        </ThemeProvider>
    }
}

