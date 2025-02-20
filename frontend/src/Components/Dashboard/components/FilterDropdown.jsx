import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const FilterDropdown = () => {
  const [showSubDropdown1, setShowSubDropdown1] = useState(false);
  const [showSubDropdown2, setShowSubDropdown2] = useState(false);
  const [showSubDropdown3, setShowSubDropdown3] = useState(false);

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="flask-dropdown">
       Flask
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => setShowSubDropdown1(!showSubDropdown1)}
        >
          Dropdown 1
        </Dropdown.Item>
        {showSubDropdown1 && (
          <Dropdown.Menu>
            <Dropdown.Item>Sub Item 1.1</Dropdown.Item>
            <Dropdown.Item>Sub Item 1.2</Dropdown.Item>
          </Dropdown.Menu>
        )}
        
        <Dropdown.Item
          onClick={() => setShowSubDropdown2(!showSubDropdown2)}
        >
          Dropdown 2
        </Dropdown.Item>
        {showSubDropdown2 && (
          <Dropdown.Menu>
            <Dropdown.Item>Sub Item 2.1</Dropdown.Item>
            <Dropdown.Item>Sub Item 2.2</Dropdown.Item>
          </Dropdown.Menu>
        )}

        <Dropdown.Item
          onClick={() => setShowSubDropdown3(!showSubDropdown3)}
        >
          Dropdown 3
        </Dropdown.Item>
        {showSubDropdown3 && (
          <Dropdown.Menu>
            <Dropdown.Item>Sub Item 3.1</Dropdown.Item>
            <Dropdown.Item>Sub Item 3.2</Dropdown.Item>
          </Dropdown.Menu>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;
