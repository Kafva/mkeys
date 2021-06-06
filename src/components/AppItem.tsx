import React from "react" 
import { SvgIconComponent } from "@material-ui/icons";
import { ListItem, ListItemIcon } from "@material-ui/core";

type AppItemProps = {
    icon?: SvgIconComponent 
}

export default class AppItem extends React.Component<AppItemProps> {

    constructor(props: AppItemProps) {
        super(props);
    }

    render(){
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
