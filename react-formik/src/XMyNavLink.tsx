import { Link, RouteComponentProps } from "react-router-dom";
import * as React from 'react';

interface IPathParamsType {
    param1: string,
}

// Your component own properties
type PropsType = RouteComponentProps<IPathParamsType> & {
    to: string,
}

class XMyNavLink extends React.Component<PropsType> {
    public render() {
        console.log("XMyNavLink", this.props);
        let isActive = this.props.location.pathname.startsWith(this.props.to); // (this as any).context.router.isActive((this as any).props.to, true);
        let className = isActive ? "active nav-item" : "nav-item";

        return (
            <li className={className}>
                <Link className="nav-link" {...this.props}/>
            </li>
        );
    }
}

export default XMyNavLink;