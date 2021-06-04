import React from "react"
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Slider from '@material-ui/core/Slider';
import { SvgIconComponent } from "@material-ui/icons";

import { DEFAULT_SKIP_SECONDS, MIN_SKIP_MINUTES, MAX_SKIP_MINUTES } from '../app/config';

type SliderProps = {
    text: string
    icon?: SvgIconComponent
}

type SliderState = {
    minutes: number
}

export default class FeatureSlider extends React.Component<SliderProps,SliderState> {

    constructor(props) {
        super(props);
        this.state = {
            minutes: DEFAULT_SKIP_SECONDS/60
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
            <ListItemText primary={this.props.text + " - " + this.state.minutes}/>    
            <Slider 
                min={MIN_SKIP_MINUTES}
                max={MAX_SKIP_MINUTES}
                defaultValue={DEFAULT_SKIP_SECONDS/60}
                
                value={this.state.minutes} 
                
                // The slider will send an event with the new value
                // as an argument when the slider changes at which
                // point we call setState to update the value
                // that the Slider is bound to
                onChange={ (event: any, newMinutes: number) => {
                    
                    this.setState( () => ({minutes: newMinutes}) )
                }} 
                aria-label={this.props.text}
            />
        </ListItem> 
    }
}


