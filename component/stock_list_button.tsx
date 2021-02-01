import React from "react";
import { Button, ButtonGroup, ButtonToolbar, DropdownToggle, ButtonDropdown, DropdownMenu, DropdownItem } from "reactstrap";

const Countries_list_button = (props: any) => {
  const countries_list_data = props.countries_list;
  const stock_item = (countries_list: any) => {
    return (
      <>
        <Button>
          <ul>
            <li>
              <h4>{countries_list.Country}</h4>
            </li>
            <li>{countries_list.Slug}</li>
          </ul>
        </Button>
      </>
    );
  };
  const countries_list = countries_list_data.map((countries_list: any) => stock_item(countries_list));
  return (
    <div className="stock_list">
      <ButtonGroup vertical>{countries_list}</ButtonGroup>
    </div>
  );
};

export default Countries_list_button;
