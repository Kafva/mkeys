import React from "react" 
import { ListItem, ListItemIcon } from "@material-ui/core";
import { AppItemProps } from '../types';

export default class AppItem extends React.Component<AppItemProps> {

    constructor(props: AppItemProps) {
        super(props);
    }

    render(): JSX.Element {
        const Icon = this.props.icon;

        // We can insert any elements placed inside <AppItem>...</AppItem> using
        // the props.children attribute
        return <ListItem>
            {Icon != null && 
               <ListItemIcon> 
                   <Icon/>
               </ListItemIcon> 
            }
            
            {this.props.children}
        </ListItem>
    }

}
