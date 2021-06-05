import React from "react"
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import { SvgIconComponent } from "@material-ui/icons";

import { DEFAULT_SKIP_SECONDS, MIN_SKIP_MINUTES, MAX_SKIP_MINUTES, MESSAGE, STORAGE_KEYS } from '../app/config';
import { setupTimeSkip } from "../features/timeskip";

const validateMinutes = (minutes: number) => {
    return MIN_SKIP_MINUTES <= minutes && minutes <= MAX_SKIP_MINUTES; 
}

const setSkipMinutes = (newMinutes: number) => {
    // Set the new skip value in the extension settings
    // through a message to the background script
    chrome.runtime.sendMessage({
        action: MESSAGE.setSettings, 
        key: STORAGE_KEYS.secondsToSkip, 
        value: newMinutes*60
    }, (response) => {
        // Once the update has finished re-initalise the
        // event listeners to set the new value for the handlers
        console.log("res", response);
        console.log(`Reseting timeskip with: ${newMinutes} minutes`);
        setupTimeSkip();
    });
}

type SliderProps = {
    text: string
    icon?: SvgIconComponent,
    initialSkipMinutes: number
}

type SliderState = {
    minutes: number
}

// -------------

export default class FeatureSlider extends React.Component<SliderProps,SliderState> {

    constructor(props) {
        super(props);
        this.state = {
            minutes: props.initialSkipMinutes
        }
    }
    
    componentDidMount() {
    }

    componentWillUnmount() {
    }
    
    render() {
        const Icon = this.props.icon;

        return <ListItem>
            {Icon != null && 
               <ListItemIcon> 
                   <Icon/>
               </ListItemIcon> 
            }
            <form noValidate autoComplete="off">
                <TextField
                    label={this.props.text}
                    aria-label={this.props.text}
                    type="number"
                    value={this.state.minutes}
                    onChange={ (event:any) => {
                            /**** callback to root with state here ****/
                        
                            // Only update the settings if the value passes validation
                            validateMinutes(event.target.value) && 
                                setSkipMinutes(event.target.value)

                            // Always update the UI so that the error and help text can be displayed
                            this.setState( () => ({minutes: event.target.value || DEFAULT_SKIP_SECONDS/60}) )
                        }
                    }
                    error={ !validateMinutes(this.state.minutes) }
                    helperText={ validateMinutes(this.state.minutes) || 
                        "Valid range: "+MIN_SKIP_MINUTES+"-"+MAX_SKIP_MINUTES+" min"
                    }
                /> 
            </form>
            <Slider 
                min={MIN_SKIP_MINUTES}
                max={MAX_SKIP_MINUTES}
                value={this.state.minutes} 
                //disabled={ this. }
                
                // The slider will send an event with the new value
                // as an argument when the slider changes at which
                // point we call setState to update the value
                // that the Slider is bound to
                onChange={ (event: any, newMinutes: number) => {
                    /**** callback to root with state here ****/
                    
                    validateMinutes(newMinutes) && 
                        setSkipMinutes(newMinutes)

                    // Update the state of the component in the UI
                    this.setState( () => ({minutes: newMinutes || DEFAULT_SKIP_SECONDS/60}) )
                }} 
            />
        </ListItem> 
    }
}


