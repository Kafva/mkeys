import React from "react"
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import { SvgIconComponent } from "@material-ui/icons";

import { MIN_SKIP_MINUTES, MAX_SKIP_MINUTES } from '../extension/config';
import { validateMinutes } from "../util/helper";

type SliderProps = {
    text: string
    minutes: number
    disabled: boolean
    icon?: SvgIconComponent
    handleChange: Function

}

// -------------
const marks = [
  {
    value: 1,
    label: '1 min',
  },
  {
    value: 30,
    label: '30 min',
  }
];

export default class FeatureSlider extends React.Component<SliderProps> {

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
            <form noValidate autoComplete="off">
                <TextField
                    label={this.props.text}
                    aria-label={this.props.text}
                    disabled={this.props.disabled}
                    type="number"
                    value={this.props.minutes}
                    onChange={ (event:any) => {
                        /**** Callback to root component to update state ****/
                        this.props.handleChange(event.target.value)
                    }}
                    error={ !validateMinutes(this.props.minutes) }
                    helperText={ validateMinutes(this.props.minutes) ? "" :
                        "Valid range: "+MIN_SKIP_MINUTES+"-"+MAX_SKIP_MINUTES+" min"
                    }
                />
            </form>
            <Slider
                min={MIN_SKIP_MINUTES}
                max={MAX_SKIP_MINUTES}
                value={this.props.minutes}
                disabled={this.props.disabled}
                marks={marks}

                onChange={ (event: any, newMinutes: number) => {
                    /**** Callback to root component to update state ****/
                    this.props.handleChange(newMinutes)
                }}
            />
        </ListItem>
    }
}


