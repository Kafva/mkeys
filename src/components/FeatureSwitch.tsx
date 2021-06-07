import React from 'react';
import Switch from '@material-ui/core/Switch';
import { SwitchProps } from '../types';

export default class FeatureSwitch extends React.Component<SwitchProps> {
	constructor(props: SwitchProps) {
		super(props);
	}

	render(): JSX.Element {
		return (
			<Switch
				checked={this.props.on}
				color="primary"
				onChange={() => {
					this.props.handleChange(this.props.storageKey, !this.props.on);
				}}
			/>
		);
	}
}
