import React, {useEffect, useRef, useState} from "react";
import {
    HTMLInputProps as BlueprintHTMLInputProps,
    InputGroupProps as BlueprintInputGroupProps,
    IRefObject
} from "@blueprintjs/core";
import {
    Suggest2 as Suggest
} from "@blueprintjs/select";
import {
    Highlighter,
    IconButton,
    Menu,
    Notification,
    MenuItem,
    OverflowText,
    Spinner,
    ContextOverlayProps,
} from "../../index";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";

type SearchFunction<T extends any> = (value: string) => T[];
type AsyncSearchFunction<T extends any> = (value: string) => Promise<T[]>;

export interface IRenderModifiers {
    active: boolean
    disabled?: boolean
    // The width styles that should be given to the rendered option items
    styleWidth: IElementWidth
    highlightingEnabled: boolean
}
/**
 * Parameters for the auto-complete field parameterized by T and U.
 * @param T is the input data structure/type of the items that can be selected.
 * @param UPDATE_VALUE The value type that will be pushed into the onChange callback.
 */
export interface IAutoCompleteFieldProps<T extends any, UPDATE_VALUE extends any> {
    /**
     * Fired when text is typed into the input field. Returns a list of items of type T.
     */
    onSearch: SearchFunction<T> | AsyncSearchFunction<T>;

    /**
     * Fired when value selected from input
     * @param value The value that has been converted with itemValueSelector.
     * @param e     The event
     */
    onChange?(value: UPDATE_VALUE, e?: React.SyntheticEvent<HTMLElement>): any;

    /**
     * The initial value for the auto-complete input field
     */
    initialValue?: T;

    /**
     * Returns the UI representation of the selectable items.
     * If the return value is a string, a default render component will be displayed with search highlighting.
     *
     * @param item  The item that should be displayed as an option in the select list.
     * @param query The current search query
     * @param modifiers Modifiers for rendered elements, e.g. active, disabled.
     * @param handleClick The function that needs to be called when the rendered item gets clicked. Else a selection
     *                    via mouse is not possible. This only needs to be used when returning a JSX.Element.
     */
    itemRenderer(item: T, query: string, modifiers: IRenderModifiers, handleClick: () => any): string | JSX.Element;

    /** Renders the string that should be displayed in the input field after the item has been selected.
     */
    itemValueRenderer(item: T): string;

    /**
     * Selects the part from the auto-completion item that is called with the onChange callback.
     * @param item The selected item that should be converted to the value that onChange is called with.
     */
    itemValueSelector(item: T): UPDATE_VALUE;

    /** The string representation of the actual value, i.e. without meta data etc. This will be used to compare if values are equal. */
    itemValueString(item: T): string

    /** The text that should be displayed when no search result has been found and no custom entry can be created. */
    noResultText: string

    /**
     * Props to spread to the underlying input field. This is BlueprintJs specific. To control this input, use
     * `query` and `onQueryChange` instead of `inputProps.value` and
     * `inputProps.onChange`.
     */
    inputProps?: BlueprintInputGroupProps & BlueprintHTMLInputProps;

    /**
     * Optional props of the internally used `<ContextOverlay/>` element..
     */
    contextOverlayProps?: Partial<Omit<ContextOverlayProps, "content" | "children">>

    /** Defines if a value can be reset, i.e. a reset icon is shown and the value is set to a specific value.
     *  When undefined, a value cannot be reset.
     */
    reset?: {
        /** Returns true if the currently set value can be reset, i.e. set to the resetValue. The reset icon is only
         *  shown if true is returned. */
        resettableValue(value: T): boolean;

        /** The value onChange is called with when a reset action is triggered. */
        resetValue: UPDATE_VALUE;

        /** The reset button text that is shown on hovering over the reset icon. */
        resetButtonText: string
    };

    /** If enabled the auto completion component will auto focus. */
    autoFocus?: boolean;

    /** Contains methods for new item creation. If undefined no new, custom items can be created. */
    createNewItem?: {
        /** Creates a new item from the query. */
        itemFromQuery: (query: string) => T;

        /** Renders how the option to newly create an item should look like in the selection list. */
        itemRenderer: (
            query: string,
            modifiers: IRenderModifiers,
            handleClick: React.MouseEventHandler<HTMLElement>
        ) => JSX.Element | undefined;

        /** If the new item option will always be shown as the first entry in the suggestion list, else it will be the last entry.
         * @default false
         */
        showNewItemOptionFirst?: boolean
    };

    /** If true the input field will be disabled. */
    disabled?: boolean;

    /** The value to which the search query should be reset after the popover closes.
     *  By default the query is reset to the result of itemValueRenderer(selectedValue).
     *
     * @param selectedValue The currently selected value.
     */
    resetQueryToValue?(selectedValue: T): string

    /** If an error occurs during the auto-completion request, the error details will be prefixed with this string. */
    requestErrorPrefix?: string
}

AutoCompleteField.defaultProps = {
    autoFocus: false,
    disabled: false,
};

/** Style object to be used in menu option items. */
export interface IElementWidth {
    width: string
    maxWidth: string
}

/** Hook that returns the element width of the given ref.*/
const elementWidth = (elRef: IRefObject<HTMLInputElement> | null): IElementWidth => {
    if(elRef && elRef.current) {
        return { width: elRef.current.offsetWidth + "px", maxWidth: "90vw" }
    } else {
        return { width: "40rem", maxWidth: "90vw" }
    }
}

/** Auto-complete input widget. */
export function AutoCompleteField<T extends any, UPDATE_VALUE extends any>(props: IAutoCompleteFieldProps<T, UPDATE_VALUE>) {
    const {
        reset,
        noResultText,
        disabled,
        itemValueSelector,
        itemRenderer,
        onSearch,
        onChange,
        initialValue,
        autoFocus,
        createNewItem,
        itemValueRenderer,
        resetQueryToValue,
        itemValueString,
        requestErrorPrefix = "",
        ...otherProps
    } = props;
    const [selectedItem, setSelectedItem] = useState<T | undefined>(initialValue);
    // If the selection list elements are currently fetched from the backend
    const [listLoading, setListLoading] = useState<boolean>(false);

    const [query, setQuery] = useState<string>("");
    const [hasFocus, setHasFocus] = useState<boolean>(false);
    const [highlightingEnabled, setHighlightingEnabled] = useState<boolean>(true);
    const [requestError, setRequestError] = useState<string | undefined>(undefined)

    // The suggestions that match the user's input
    const [filtered, setFiltered] = useState<T[]>([]);

    const BlueprintSuggestAutocomplete = Suggest.ofType<T>();

    // Sets the query to the item value if it has a valid string value
    const setQueryToSelectedValue = (item?: T) => {
        if (item) {
            // If new values can be created, always reset the query value to the actual value of the selected item.
            // This e.g. prevents that the "create new" option will be shown, since an item with the same value already exists.
            const defaultResetValue: string = createNewItem ? (
                itemValueString(item) as string
            ) : itemValueRenderer(item)
            const resetVal = resetQueryToValue ? resetQueryToValue(item) : defaultResetValue
            setQuery(resetVal)
        }
    };

    const fieldRef = useRef(null)

    // The key for the option elements
    const itemKey = (item: T): string => {
        return itemValueString(item);
    };

    useEffect(() => {
        setQueryToSelectedValue(selectedItem);
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedItem]
    );

    useEffect(() => {
        if (!disabled && hasFocus) {
            setListLoading(true);
            const timeout: number = window.setTimeout(async () => {
                fetchQueryResults(query);
            }, 200);
            return () => {
                clearTimeout(timeout);
                setListLoading(false);
            };
        }
        return;
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [hasFocus, query]
    );

    const fieldWidthLimits = elementWidth(fieldRef);

    // We need to fire some actions when the auto-complete widget gets or loses focus
    const handleOnFocusIn = () => {
        setHasFocus(true);
    };

    const handleOnFocusOut = () => {
        setHasFocus(false);
    };

    // On popover close reset query to selected item
    const onPopoverClose = () => {
        // Reset query to selected value when loosing focus, so the selected value can always be edited.
        setQueryToSelectedValue(selectedItem);
        // Reset option list when the popover closes, so next use there is not displayed a stale list
        setFiltered([]);
    }

    // Triggered when an item from the selection list gets selected
    const onSelectionChange = (value: any, e: any) => {
        setSelectedItem(value);
        onChange?.(itemValueSelector(value), e);
        setQueryToSelectedValue(value);
    };

    const areEqualItems = (itemA: any, itemB: any) => itemValueSelector(itemA) === itemValueSelector(itemB);

    // Return the index of the item in the array based on the itemValueRenderer value
    const itemIndexOf = (arr: T[], searchItem: T): number => {
        let idx = -1;
        const searchItemString = itemValueString(searchItem);
        arr.forEach((v, i) => {
            if (itemValueString(v) === searchItemString) {
                idx = i;
            }
        });
        return idx;
    };

    // Fetches the results for the given query
    const fetchQueryResults = async (input: string) => {
        setListLoading(true);
        setRequestError(undefined)
        try {
            let result = await onSearch(input);
            const onlySelectItemReturned = result.length <= 1 && selectedItem && input.length > 0 &&
                (itemValueRenderer(selectedItem) === input || itemValueString(selectedItem) === input)
            let enableHighlighting = true;
            if (onlySelectItemReturned) {
                // If the auto-completion only returns no suggestion or the selected item itself, query with empty string.
                const emptyStringResults = await onSearch("");
                // Disable highlighting, since we used empty string search
                enableHighlighting = false;
                // Put selected item at the top if it is not in the result list
                if (!!selectedItem && itemIndexOf(emptyStringResults, selectedItem) > -1) {
                    emptyStringResults.splice(itemIndexOf(emptyStringResults, selectedItem), 1)
                    result = [selectedItem, ...emptyStringResults];
                } else {
                    result = emptyStringResults;
                }
            }
            setHighlightingEnabled(enableHighlighting);
            setFiltered(result);
        } catch (e: any) {
            const details = e?.message ?? ""
            setRequestError(requestErrorPrefix + details)
        } finally {
            setListLoading(false);
        }
    };

    // Renders the item in the selection list
    const optionRenderer = (item: any, { handleClick, modifiers, query }: {handleClick: any, modifiers: any, query: any}) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const relevantModifiers: IRenderModifiers = {
            active: modifiers.active,
            disabled: modifiers.disabled,
            styleWidth: fieldWidthLimits,
            highlightingEnabled: highlightingEnabled,
        }
        const renderedItem = itemRenderer(item, query, relevantModifiers, handleClick);
        if (typeof renderedItem === "string") {
            return (
                <MenuItem
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    key={itemKey(item)}
                    onClick={handleClick}
                    text={
                        <OverflowText style={fieldWidthLimits}>
                            {!highlightingEnabled ? renderedItem : <Highlighter label={renderedItem} searchValue={query} />}
                        </OverflowText>
                    }
                />
            );
        } else {
            return renderedItem;
        }
    };
    // Resets the selection
    const clearSelection = (resetValue: UPDATE_VALUE) => () => {
        setSelectedItem(undefined);
        onChange?.(resetValue);
        setQuery("");
    };
    const requestErrorRenderer = () => {
        return <Notification danger={true} message={requestError} />
    }
    // Optional clear button to reset the selected value
    const clearButton = reset &&
        selectedItem != null &&
        reset.resettableValue(selectedItem) ? (
            <IconButton
                data-test-id={
                    (otherProps.inputProps?.id ? `${otherProps.inputProps.id}-` : "") + "auto-complete-clear-btn"
                }
                name="operation-clear"
                text={reset.resetButtonText}
                onClick={clearSelection(reset.resetValue)}
            />
        ) : undefined;
    // Additional properties for the input element of the auto-completion widget
    const updatedInputProps: BlueprintInputGroupProps & BlueprintHTMLInputProps = {
        rightElement: clearButton,
        autoFocus: autoFocus,
        onBlur: handleOnFocusOut,
        onFocus: handleOnFocusIn,
        ...otherProps.inputProps,
    };
    const updatedContextOverlayProps: Partial<Omit<ContextOverlayProps, "content" | "children">> = {
        minimal: true,
        placement: "bottom-start",
        popoverClassName: `${eccgui}-autocompletefield__options`,
        rootBoundary: "viewport",
        onClosed: onPopoverClose,
        ...otherProps.contextOverlayProps,
    }
    if(selectedItem !== undefined) {
        // Makes sure that even when an empty string is selected, the placeholder won't be shown.
        updatedInputProps.placeholder = ""
    }
    // For some reason Typescript is not able to infer the union type from the ternary expression
    const createNewItemPosition: "first" | "last" = createNewItem?.showNewItemOptionFirst ? "first" : "last"
    const createNewItemProps = createNewItem ? {
        createNewItemFromQuery: createNewItem.itemFromQuery,
        createNewItemRenderer: (query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => {
            if(selectedItem && query === itemValueString(selectedItem)) {
                // Never show create new item option if the same item is already selected
                return undefined
            } else {
                return createNewItem!!.itemRenderer(query, {active, styleWidth: fieldWidthLimits, highlightingEnabled: false}, handleClick)
            }
        },
        createNewItemPosition
    } : {}
    return (
        <div ref={fieldRef}>
            <BlueprintSuggestAutocomplete
                className={`${eccgui}-autocompletefield__input`}
                disabled={disabled}
                // Need to display error messages in list
                items={requestError ? [requestError as T] : filtered}
                inputValueRenderer={selectedItem !== undefined ? itemValueRenderer : () => ""}
                itemRenderer={requestError ? requestErrorRenderer : optionRenderer}
                itemsEqual={areEqualItems}
                noResults={<MenuItem disabled={true} text={noResultText} style={fieldWidthLimits} />}
                onItemSelect={onSelectionChange}
                onQueryChange={(q) => setQuery(q)}
                closeOnSelect={true}
                query={query}
                // This leads to odd compile errors without "as any"
                popoverProps={updatedContextOverlayProps as any}
                selectedItem={selectedItem}
                fill
                {...createNewItemProps}
                // This leads to odd compile errors without "as any"
                inputProps={updatedInputProps as any}
                itemListRenderer={listLoading ? () => <Menu><MenuItem disabled={true} text={<Spinner position={"inline"} />} style={fieldWidthLimits} /></Menu> : undefined}
            />
        </div>
    );
}
