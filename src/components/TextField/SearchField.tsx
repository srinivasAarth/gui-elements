import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";
import IconButton from "../Icon/IconButton";
import TextField from "./TextField";

function SearchField({
    className = "",
    emptySearchInputMessage = "Enter search term",
    onClearanceHandler,
    onClearanceText,
    ...otherProps
}: any) {
    return (
        <TextField
            className={
                `${eccgui}-textfield--searchinput` +
                (onClearanceHandler ? ` ${eccgui}-textfield--justifyclearance` : "") +
                (className ? ` ${className}` : "")
            }
            dir={"auto"}
            placeholder={emptySearchInputMessage}
            aria-label={emptySearchInputMessage}
            rightElement={
                onClearanceHandler && otherProps.value ? (
                    <IconButton
                        name="operation-clear"
                        text={onClearanceText ? onClearanceText : "Clear current search term"}
                        onClick={onClearanceHandler}
                    />
                ) : (
                    false
                )
            }
            {...otherProps}
            type={"search"}
            leftIcon={"operation-search"}
            round={true}
        />
    );
}

export default SearchField;
