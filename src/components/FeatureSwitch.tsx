import React from "react"
import Switch from '@material-ui/core/Switch';

type SwitchProps = {
    storageKey: string // Using 'key' as the prop name causes weird behaviour
    on: boolean
    handleChange: Function
}

export default class FeatureSwitch extends React.Component<SwitchProps> {

    constructor(props) {
        super(props);
    }
    
    render() {
        return <Switch 
                checked={this.props.on}
                color="primary"
                onChange={ () => {
                    this.props.handleChange(
                        this.props.storageKey, !this.props.on
                    ) 
                }}
            />
    }
}
