import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import FieldItemRow from "../FieldItemRow";
import FieldSet from "../FieldSet";
import { Default as  FieldItemRowStory} from "./FieldItemRow.stories";




export default {
    title: "Components/Form",
    component: FieldSet,
    argTypes: {
        children: {
            control: "none",
            description: "Elements to include into the Accordion component",
        },
        boxed : {
            control : "boolean",
            discription : "aligned in a padding box",
        },
        hasStatePrimary : {
            control : 'boolean',
            discription : "primary color state"
        },
        hasStateSuccess : {
            control : 'boolean',
            discription : "success color state"
        },
        hasStateWarning : {
            control : 'boolean',
            discription : "warning color state"
        },
        hasStateDanger : {
            control : 'boolean',
            discription : "danger color state"
        },
    }

} as ComponentMeta<typeof FieldSet>;

const Template: ComponentStory<typeof FieldSet> = (args) => (
    <FieldSet {...args} />
);  
export const Default = Template.bind({});
Default.args = {
    children : [
        <>
        <FieldItemRow {...FieldItemRowStory.args}/>
        <FieldItemRow {...FieldItemRowStory.args}/>
        <FieldItemRow {...FieldItemRowStory.args}/>
        </>
    ],
};