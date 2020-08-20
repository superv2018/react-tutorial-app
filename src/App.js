import React, { Component } from "react";
import "./App.css";

import Search from './components/Search';
import Table from './components/Table';



const list = [
  {
    title: "React",
    url: "https://reactjs.org",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: "Java",
    url: "https://redux.js.org",
    author: "SuperV, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 3,
  },
  {
    title: "Redux",
    url: "https://redux.js.org",
    author: "Adeola Ojo, Andrew Clark",
    num_comments: 6,
    points: 8,
    objectID: 4,
  },
];

const isSearched = (searchTerm) => (item) => item.title.toLowerCase().includes(searchTerm.toLowerCase())

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
   
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }


  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <div className="interactions">
        <Search 
        searchTerm={searchTerm} 
        onSearchChange={this.onSearchChange}
        >
          Search
        </Search >
        </div>
        <Table 
        list={list} 
        onDismiss={this.onDismiss} 
        searchTerm={searchTerm} 
        isSearched={isSearched} />
     </div>
      
    );
  }
}

export default App;
