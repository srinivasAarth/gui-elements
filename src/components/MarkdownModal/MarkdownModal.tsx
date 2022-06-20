import React from "react";
import {
    Tag,
    TagList,
    SimpleDialog,
    Icon,
    Button,
    FieldItem,
} from "./../../index";
import getColorConfiguration from "../../common/utils/getColorConfiguration";
import { CodeEditor } from "../../extensions/codemirror/CodeMirror";

export type MarkdownModalTranslationKeys = "modalTitle" | "noteLabel" | "colorLabel" | "saveButton" | "cancelButton";

export interface MarkdownModalProps {
    content: Map<string, string>;
    onClose: () => void;
    onSubmit: (data: { note: string; color: string }) => void;
    translate: (key: MarkdownModalTranslationKeys) => string;
}

const MarkdownModal: React.FC<MarkdownModalProps> = ({
    content,
    onClose,
    onSubmit,
    translate
}) => {
    const refNote = React.useRef<string>(content.get("note") ?? "");
    const [color, setSelectedColor] = React.useState<string>(content.get("color") ?? "");
    const noteColors = getColorConfiguration("stickynotes");

    const predefinedColorsMenu = (
        <TagList>
            {noteColors &&
                Object.keys(noteColors).map((colorname: string) => {
                    const colorvalue = noteColors[colorname];
                    const selectedFeedback =
                        color === colorvalue
                            ? {
                                  icon: <Icon name="state-checkedsimple" />,
                                  large: true,
                              }
                            : {};
                    return (
                        <Tag
                            round
                            onClick={() => setSelectedColor(colorvalue)}
                            backgroundColor={colorvalue}
                            {...selectedFeedback}
                            key={colorname}
                        />
                    );
                })}
        </TagList>
    );

    return (
        <SimpleDialog
            data-test-id={"sticky-note-modal"}
            size="small"
            title={translate("modalTitle")}
            hasBorder
            isOpen
            onClose={onClose}
            actions={[
                <Button
                    key="submit"
                    affirmative
                    onClick={() => {
                        onSubmit({ note: refNote.current.toString(), color });
                        onClose();
                    }}
                >
                    {translate("saveButton")}
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    {translate("cancelButton")}
                </Button>,
            ]}
        >
            <FieldItem
                key="note"
                labelAttributes={{
                    htmlFor: "noteinput",
                    text: translate("noteLabel"),
                }}
            >
                <CodeEditor
                    name={translate("noteLabel")}
                    id={"noteinput"}
                    mode="markdown"
                    preventLineNumbers
                    onChange={(value) => {
                        refNote.current = value;
                    }}
                    defaultValue={refNote.current}
                />
            </FieldItem>
            <FieldItem
                key="color"
                labelAttributes={{
                    htmlFor: "colorinput",
                    text: translate("colorLabel"),
                }}
            >
                {predefinedColorsMenu}
            </FieldItem>
        </SimpleDialog>
    );
};

export default MarkdownModal;
