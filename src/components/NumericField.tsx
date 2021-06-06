import React from "react"
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import { SvgIconComponent } from "@material-ui/icons";

import { MIN_SKIP_MINUTES, MAX_SKIP_MINUTES } from '../extension/config';
import { validateMinutes } from "../util/helper";

type NumericProps = {
    text: string
    minutes: number
    disabled: boolean
    handleChange: Function
}

export default class NumericField extends React.Component<NumericProps> {

    constructor(props) {
        super(props);
    }

    render() {
        return <form noValidate autoComplete="off">
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
                    chrome.i18n.getMessage("validRange") +
                    +MIN_SKIP_MINUTES+"-"+MAX_SKIP_MINUTES+" min"
                }
            />
        </form>
    }
}


