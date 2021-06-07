import React from "react"
import TextField from '@material-ui/core/TextField';
import { Config } from '../extension/config';
import { validateMinutes } from "../util/helper";
import { NumericProps } from "../types";

export default class NumericField extends React.Component<NumericProps> {

    constructor(props: NumericProps) {
        super(props);
    }

    render(): JSX.Element {
        return <form noValidate autoComplete="off">
            <TextField
                label={this.props.text}
                aria-label={this.props.text}
                disabled={this.props.disabled}
                type="number"
                value={this.props.minutes}
                onChange={ (event: React.ChangeEvent<HTMLTextAreaElement> ) => {
                    /**** Callback to root component to update state ****/
                    const newNumber = parseInt(event.target.value);
                    this.props.handleChange( 
                        !isNaN(newNumber) ? newNumber : Config.DEFAULT_SKIP_MINUTES
                    );
                }}
                error={ !validateMinutes(this.props.minutes) }
                helperText={ validateMinutes(this.props.minutes) ? "" :
                    chrome.i18n.getMessage("validRange") +
                    +Config.MIN_SKIP_MINUTES+"-"+Config.MAX_SKIP_MINUTES+" min"
                }
            />
        </form>
    }
}


