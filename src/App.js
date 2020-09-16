import React, { Component } from "react";
import axios from 'axios';
import { sortBy } from 'lodash';
import "./App.css";

import Search from "./components/Search";
import Table from "./components/Table";
import Button from './components/Button'

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = '100';

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const Loading = () => 
<div>Loading ...</div>

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    
    const { searchKey, results } = prevState;

    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    return { 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
        },
        isLoading: false
      }
    }
  

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: 'NONE',
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

//added default search with paginated search
  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then((result) => this.setSearchTopStories(result.data))
      .catch((error) => this.setState({ error }));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm)
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    

    event.preventDefault();
  }

  //get search input from form
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({ 
      results: {
      ...results,
      [searchKey]: {hits: updatedHits, page }
      },
     
    });
  }

  onSort(sortKey) {
    this.setState({ sortKey });
  }

  render() {
    const { searchTerm, 
      results, 
      searchKey,
      error,
      isLoading,
      sortKey,
    } = this.state;

  

    //default to page 0 if no result
    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
     ) || 0; 
    

    const list = (
      results && 
      results[searchKey] &&
      results[searchKey].hits
    ) || [];
    
    return (
      <div className="page">
        <div className="interactions">
          <Search searchTerm={searchTerm} onSearchChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { error 
        ? <div className="interactions">
          <p>Something went wrong.</p>
        </div>
         : <Table
          list={list}
          sortKey={sortKey}
          onSort={this.onSort}
          sorts={SORTS}
          onDismiss={this.onDismiss}
        /> 
        }
        <div className='interactions'>
          { isLoading ? <Loading/>
          : <Button 
              onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                More
              </Button>
          }
          
        </div>
      </div>
    );
  }
}

export default App;

export {
  Button,
  Search,
  Table,
};