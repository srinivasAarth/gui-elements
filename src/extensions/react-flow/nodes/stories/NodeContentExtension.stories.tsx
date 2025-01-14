import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';

import {
    NodeContentExtension,
    NodeContentExtensionProps
} from "./../NodeContentExtension";
import IconButton from "../../../../components/Icon/IconButton";
import HtmlContentBlock from "../../../../components/Typography/HtmlContentBlock";

export default {
    title: "Extensions/React Flow/Node Content Extension",
    component: NodeContentExtension,
    argTypes: {
        children: { control: "none" },
        actionButtons: { control: "none" },
    },
} as ComponentMeta<typeof NodeContentExtension>;

const Template: ComponentStory<typeof NodeContentExtension> = (args: NodeContentExtensionProps) => (
    <NodeContentExtension {...args} /*some comment*/ />
);

export const Default = Template.bind({});
Default.args = {
    actionButtons: <IconButton name="item-question" onClick={(e) => { alert("this is a action button"); }} />,
    slideOutOfNode: false,
    isExpanded: false,
    setExpanded: (_event: React.MouseEvent<HTMLElement>, expanded: boolean) => {
        return !expanded;
    },
    children: (
        <HtmlContentBlock>
            <h4>Extension example.</h4>
            <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
        </HtmlContentBlock>
    )
} as NodeContentExtensionProps;

export const SlideOutOfNode = Template.bind({});
SlideOutOfNode.args = {
    ...Default.args,
    slideOutOfNode: true,
} as NodeContentExtensionProps;

export const WithoutExpansionHandler = Template.bind({});
WithoutExpansionHandler.args = {
    ...Default.args,
    setExpanded: undefined,
} as NodeContentExtensionProps;
