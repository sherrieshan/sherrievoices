import React, { Component } from 'react';
import Landing from './Landing';
import Demos from './Demos';
import About from './About';
import './App.css';

const test = true;
const tabNames = ["home", "demos", "about"];  // the names of the components/tabs
const maxPageLengh = 1000000;                 // the max page length for y scrolling
const padding = 50;                          // extra padding before component to determine active
const transitionBorder = "demos";             // tab that indicates the border where menu out/in
const transPadding = 50;                     // padding for where transition begins

class App extends Component {
  constructor() {
    super();

    //set up the prop with the right parameters and set defaults
    var p = {};
    for(var i = 0; i < tabNames.length; i++) {
      p[tabNames[i] ] = 0;
    }
    this.values = p;
    this.transitionValue = 1000; // default for where menu transitions in
    this.state = {
      activeTab: "",
      displayMenu: false
    }; // set state
  }

  
  // when link/nav button is clicked, then scroll to there in window after determining
  // the element it needs to scroll to
  scrollTo(id) {
    // first get the element by id
    var e = document.getElementById(id);
    // then scroll into view with a smooth behavior and to the start of the block
    e.scrollIntoView({behavior: "smooth", block: "start"});
    // setting tab should be taken care of by the listener
    // this.setActiveTab(id);
  }
  
  // set the active tab in navigation so it reflects the correct color
  // responds to the event of wherever the page is currently scrolled at
  setActiveTab(id) {
    this.setState({activeTab: id});
  }

  // set the y values of the components after they have mounted
  setComponentY(value, name) {
    this.values[name] = value - padding;
    // if setting value for transition border, then set the value for 
    // when transition occurs
    if(name === transitionBorder) {
      this.transitionValue = value - transPadding;
    }
  }

  handleScroll(event) {
    console.log(window.scrollY);
    var currY = window.scrollY;
    var s = Object.assign({}, this.state);
    // first determine if need to show or hide the menu
    // 1. if scroll is not past transition value and displayMenu is false, do nothing
    // 2. if scroll is not past transition value and displayMenu is true, change to false
    // 3. if scroll is past transition value and displayMenu is false, change to true
    // 4. if scroll is past transition value and displayMenu is true, do nothing
    if((currY < this.transitionValue && s.displayMenu) ||
        (currY > this.transitionValue && !s.displayMenu)){
      s.displayMenu = !s.displayMenu; // change the boolean to display
      // and set the state
      this.setState(s);
    }

    // see where the current scroll y is
    // now check between each component to see if it's between any of the components
    // if it is, then go ahead and set that as active in the navigation and return
    for(var i = 0; i < tabNames.length; i++){
      var name = tabNames[i];
      // go through each start/end values in state
      var start = this.values[name];
      // end is either max page length, or the beginning of next section
      var end = (i === tabNames.length - 1) ? maxPageLengh : this.values[tabNames[ i + 1]];
      if(start < currY && currY < end) {
        // it's inbetween this component, set active tab and stop
        this.setActiveTab(name);
        return;
      }
    }
  }

  componentDidMount() {
    console.log(this.state);
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  render() {
    return (
      <div className="app" id="home">
        <ul className="app-menu">
          <a onClick={() => this.scrollTo("demos")}><li>Demos</li></a>
          <li style={{fontSize: 60+'px', color:'white'}}>Sherrie Voices</li>
          <a onClick={() => this.scrollTo("about")}><li>About Me</li></a>
        </ul>
        <nav id="app-nav" className={this.state.displayMenu ? "" : "hidden"}>
          <a 
            className={this.state.activeTab === "home" ? "nav-active": ""} 
            onClick={() => this.scrollTo("home")}>Home</a>
          <a 
            className={this.state.activeTab === "demos" ? "nav-active": ""} 
            onClick={() => this.scrollTo("demos")}>Demos</a>
          <a 
            className={this.state.activeTab === "about" ? "nav-active": ""} 
            onClick={() => this.scrollTo("about")}>About me</a>
        </nav>
        <Landing/>
        <Demos setY={(value) => this.setComponentY(value, "demos")}/>
        <About setY={(value) => this.setComponentY(value, "about")}/>
        <ul className="contacts"> 
          <a href="https://soundcloud.com/sherrie-shan-744088758">
            <li><i className="fab fa-soundcloud fa-3x"></i></li>
          </a>
          <a href="https://www.linkedin.com/in/sherrieshan/">
            <li><i className="fab fa-linkedin fa-3x"></i></li>
          </a>
        </ul>
      </div>
    );
  }
}

export default App;