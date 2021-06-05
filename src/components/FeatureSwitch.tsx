import React from "react"
import Switch from '@material-ui/core/Switch';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { SvgIconComponent } from "@material-ui/icons";

type SwitchProps = {
    storageKey: string // Using 'key' as the prop name causes weird behaviour
    text: string
    on: boolean
    icon?: SvgIconComponent
    handleChange: Function
}

export default class FeatureSwitch extends React.Component<SwitchProps> {

    constructor(props) {
        super(props);
    }
    
    render() {
        const Icon = this.props.icon;

        return <ListItem>
            {Icon != null && 
               <ListItemIcon> 
                   <Icon/>
               </ListItemIcon> 
            }
            <ListItemText primary={this.props.text + " - " + (this.props.on ? "(on)" : "(off)") }/>    
            <Switch 
                checked={this.props.on}
                color="primary"
                onChange={ () => {
                    console.log("Passing", this.props.storageKey);
                    this.props.handleChange(
                        this.props.storageKey, !this.props.on
                    ) 
                }}
            />
        </ListItem> 
    }
}
