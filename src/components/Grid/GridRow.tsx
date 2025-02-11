import React from "react";
// import PropTypes from 'prop-types';
import { Row as CarbonRow } from "carbon-components-react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function GridRow({
    children,
    className = "",
    dontWrapColumns = true,
    fullHeight = false,
    verticalStretched,
    ...otherProps
}: any) {
    return (
        <CarbonRow
            {...otherProps}
            className={
                `${eccgui}-grid__row` +
                (dontWrapColumns ? ` ${eccgui}-grid__row--dontwrapcolumns` : "") +
                (verticalStretched ? ` ${eccgui}-grid__row--stretched` : "") +
                (fullHeight ? ` ${eccgui}-grid__row--fullheight` : "") +
                (className ? " " + className : "")
            }
        >
            {children}
        </CarbonRow>
    );
}

export default GridRow;
