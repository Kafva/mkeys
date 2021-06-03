import * as React from "react"        // The core features of React
import * as ReactDOM from "react-dom" // Mainly used to mount the root components
import "../styles/popup.css"

// Localisation: https://developer.chrome.com/docs/extensions/reference/in/

// TSX: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components/

// Enable smart toggle for videos with a length over x seconds
// * On/Off button component (for toggle features)
// * Slider component (for skip time)

// In TypeScript we need to define the props 
// and state attributes for each component
type SquareProps = {
    color: string,
    text: string,
    length?: number, // Optional attributes
    height?: number
}

type SquareState = {
    x: number,
    y: number
}

class Square extends React.Component<SquareProps, SquareState> {
    // React components take 'props' as input and return a
    // hierarchical JSX.Element through render() 

    // React components have an internal state variable
    state: SquareState = {
        x: 0,
        y: 0,
    };
    
    constructor(props: SquareProps) {
        super(props);
    }

    render() {
        // JSX syntax gives a shorthand way to invoke .createElement()
        
        let className = "square";
        if (this.props.color != 'black'){
            className+= "-" + this.props.color;
        }

        return (
            <div className={className}>
                <h1> { this.props.text } </h1>
            </div>
            
            //<div className="popup-padded">
            //    <h1>{ chrome.i18n.getMessage("l10nHello") + " " +  this.props.color }</h1>
            //</div>
        ) 
    }
}


// --------------

ReactDOM.render(
    // When React sees a user defined component it passes all params and
    // sub-elements as a single object: 'props'
    <Square color="blue"  text="react harder XDDD" />,
    document.getElementById('root')
)