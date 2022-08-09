import React from "react"
import Menu from '../Menu'
import MenuDivider from '../MenuDivider'
import MenuItem from '../MenuItem'
export default {
    title: "Components/Menu",
    component: Menu,
    argTypes: {
       onClick : {control : 'action'},
    }

}

const MenuExample = (args) => (
    <>
  <Menu  {...args} >
  <MenuDivider title ="Menu"/>
   <MenuItem {...args} key="m0" text={"First option"}   icon ={[ "operation-filteredit"]}/>
        <MenuItem {...args} key="m1" text={"Item two"} icon ={[ "toggler-tree"]}>
            <MenuItem key="m0" text={"First sub option"} />
            <MenuItem key="m1" text={"Sub item two"} >
               <MenuItem key="m0" text={"child sub options"} />
               <MenuItem key="m1" text={"child sub options"} />
               <MenuItem key="m2" text={"child sub options"} />
               <MenuItem key="m3" text={"child sub options"} />
            </MenuItem>
        </MenuItem>

  </Menu>
    </>
);


export const Default  = MenuExample.bind({});
Default.args = {
  className : '',
  large  : false,
  multiline :true,
  disabled : false,
  active : false,
  href: " "
};