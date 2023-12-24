import {useState} from "react";
import {Link, useLocation} from "react-router-dom";

interface  HeaderProps{
    title?:string,
    subTitle?:string,
}
function Header(props:HeaderProps) {
    const location = useLocation();
    const [burgerMenuIsOpen,setBurgerMenuIsOpen] = useState(false);
    const [activeLink,setActiveLink] = useState('');

    const links = ['Home','Examples','Documentation','Download'];
    const tabs=['Users','Modifiers','Grid','Elements','Components','Layout'];

    const linksItems = links.map((link) =>{
        return (
            <a key={'header-link='+link} className={`navbar-item ${link === activeLink?'is-active': ''}`}
               onClick={()=> setActiveLink(link)}
            >
                {link}
            </a>
        )
    })
    const tabItems = tabs.map(tab=>{
        return (
            <li key={'header-tab-'+tab} className={`${location.pathname.startsWith('/'+tab)? 'is-active': ''}`}
                // onClick={()=> setActiveTab(tab)}
            >
                <Link to={`/${tab}`}>{tab}</Link>
            </li>
        )
    })


    // let blocker = useBlocker(
    //     ({ currentLocation, nextLocation }) =>
    //         currentLocation.pathname !== nextLocation.pathname
    // );

    return (
        <>
            <section className="hero is-primary is-medium">
                <div className="hero-head">
                    <nav className="navbar">
                        <div className="container">
                            <div className="navbar-brand">
                                <a className="navbar-item">
                                    <img src="https://bulma.io/images/bulma-type-white.png" alt="Logo"/>
                                </a>
                                <span className={`navbar-burger ${burgerMenuIsOpen?'is-active':''}`} data-target="navbarMenuHeroA" onClick={()=> setBurgerMenuIsOpen(prev => !prev)}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </div>
                            <div id="navbarMenuHeroA" className={`navbar-menu ${burgerMenuIsOpen?'is-active':''}`}>
                                <div className="navbar-end">
                                    {linksItems}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="hero-body">
                    <div className="container has-text-centered">
                        <p className="title">
                            {props.title?? "Title"}
                        </p>
                        <p className="subtitle">
                            {props.subTitle?? "Subtitle"}
                        </p>
                    </div>
                </div>

                <div className="hero-foot">
                    <nav className="tabs is-boxed is-fullwidth">
                        <div className="container">
                            <ul>
                                {tabItems}
                            </ul>
                        </div>
                    </nav>
                </div>
            </section>
            {/*{blocker.state === "blocked" ? (*/}
            {/*    <div>*/}
            {/*        <p>Are you sure you want to leave?</p>*/}
            {/*        <button onClick={() => blocker.proceed!()}>*/}
            {/*            Proceed*/}
            {/*        </button>*/}
            {/*        <button onClick={() => blocker.reset!()}>*/}
            {/*            Cancel*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*) : null}*/}
        </>
    )
}

export default Header;
