import React, { useState } from "react";
import { ComponentMeta } from "@storybook/react";
import { LoremIpsum } from 'react-lorem-ipsum';

import { NodeContentExtension } from "./../NodeContentExtension";
import IconButton from "../../../../components/Icon/IconButton";
import HtmlContentBlock from "../../../../components/Typography/HtmlContentBlock";

export default {
    title: "Extensions/React Flow/Node Content Extension",
    component: NodeContentExtension,
    argTypes: {
    },
} as ComponentMeta<typeof NodeContentExtension>;

export const Default = () => {
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const toggleExpansion = (event: React.MouseEvent<HTMLElement>, expanded: boolean) => {
        setExpanded(!expanded);
    }

    return (
        <NodeContentExtension
            isExpanded={isExpanded}
            onToggle={toggleExpansion}
            actionButtons={
                <IconButton name="item-question" onClick={(e) => { alert("this is a action button"); }} />
            }
        >
            <HtmlContentBlock>
                <h4>Extension example.</h4>
                <LoremIpsum p={2} avgSentencesPerParagraph={4} random={false} />
            </HtmlContentBlock>
        </NodeContentExtension>);
}