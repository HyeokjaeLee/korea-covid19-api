import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const countries_list_data = props.countries_list;
  countries_list_data.sort(function (a: { Country: string }, b: { Country: string }) {
    return a.Country < b.Country ? -1 : a.Country > b.Country ? 1 : 0;
  });
  const stock_item = (countries_list: any) => {
    return (
      <>
        <DropdownItem>{countries_list.Country}</DropdownItem>
      </>
    );
  };
  const countries_list = countries_list_data.map((countries_list: any) => stock_item(countries_list));
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">reactstrap</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/components/">Components</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Countries
              </DropdownToggle>
              <DropdownMenu left>
                <div style={{ height: "500px", overflow: "scroll" }}>{countries_list}</div>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>Simple Text</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Example;
