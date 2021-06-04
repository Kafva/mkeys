import React from "react"
import Switch from '@material-ui/core/Switch';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { SvgIconComponent } from "@material-ui/icons";

type SwitchProps = {
    text: string
    icon?: SvgIconComponent
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
            on: false
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
                    this.setState( (state: SwitchState) => ({ on: !state.on }) )
                }} 
            />
        </ListItem> 
    }
}
