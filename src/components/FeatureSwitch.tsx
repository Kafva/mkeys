import React from "react"
import Switch from '@material-ui/core/Switch';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { SvgIconComponent } from "@material-ui/icons";
import { MESSAGE, STORAGE_KEYS } from "../app/config";
import { setupTimeSkip } from "../features/timeskip";

type SwitchProps = {
    text: string
    initialOnValue: boolean
    icon?: SvgIconComponent,
}

type SwitchState = {
    on: boolean
}

export default class FeatureSwitch extends React.Component<SwitchProps,SwitchState> {

    constructor(props) {
        super(props);
        // The state shoulld only be directly assigned to
        // in the constructor, everywhere else
        // .setState() should be used 
        this.state = {
            on: this.props?.initialOnValue || false
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
            <ListItemText primary={this.props.text + " - " + (this.state.on ? "(on)" : "(off)") }/>    
            <Switch 
                checked={this.state.on}
                color="primary"
                onChange={ () => {
                    /**** callback to root with state here ****/
                    let newState = !this.state.on;

                    // Update the back-end settings in the extension
                    chrome.runtime.sendMessage({
                        action: MESSAGE.setSettings, 
                        key: STORAGE_KEYS.timeSkipEnabled, 
                        value: newState 
                    }, (response) => {
                        // Setup the timeskip feature if the
                        // newState was the 'active' state
                        console.log("res", response);
                        console.log(`${newState ? "Enabling" : "Disabling"} timeskip`);
                        newState && setupTimeSkip();
                    });

                    // Update the UI
                    this.setState( (state: SwitchState) => ({ on: newState }) )
                }} 
            />
        </ListItem> 
    }
}
