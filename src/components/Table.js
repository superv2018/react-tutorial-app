import React from "react";
import Button from "./Button";
import PropTypes from 'prop-types';

const largeColumn = {
  width: '40%',
}

const midColumn = {
  width: '30%',
}

const smallColumn = {
  width: '10%',
}

const Table = ({ list, sortKEY, onSort, onDismiss, sorts  }) => 
    <div className="table">
      {list.map((item) => 
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <Button onClick={() => onDismiss(item.objectID)}className="button-inline">Dismiss</Button>
          </div>
        
      )}
    </div>
  
  Table.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        objectID: PropTypes.string.isRequired,
        author: PropTypes.string,
        url: PropTypes.string,
        num_comments: PropTypes.number,
        points: PropTypes.number,
      })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
  }


export default Table;
