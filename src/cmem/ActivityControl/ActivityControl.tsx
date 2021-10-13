import React from "react";
import {
    Card,
    ContextMenu,
    IconButton,
    MenuItem,
    OverflowText,
    OverviewItem,
    OverviewItemActions,
    // OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    ProgressBar,
    // Spinner,
    Tooltip,
} from "../../../index";
import {CLASSPREFIX as eccgui} from "../../configuration/constants";
import {TestableComponent} from "../../components/interfaces";
import { ProgressBarProps } from "../../components/ProgressBar/ProgressBar";

export interface IActivityControlProps extends TestableComponent {
    // The label to be shown
    label?: string | JSX.Element
    // The progress bar parameters. If this object is missing then no progressbar will be shown.
    progress?: ProgressBarProps
    // Status message
    statusMessage?: string
    // The action buttons
    activityActions?: IActivityAction[]
    // Context menu items
    activityContextMenu?: IActivityContextMenu
}

interface IActivityContextMenu extends TestableComponent {
    // Tooltip for the context menu
    tooltip?: string
    // The entries of the context menu
    menuItems: IActivityMenuAction[]
}

export interface IActivityAction extends TestableComponent {
    // The action that should be triggered
    action: () => any
    // The tooltip that should be shown over the action icon
    tooltip?: string
    // The icon of the action button
    icon: string
}

export interface IActivityMenuAction extends IActivityAction, TestableComponent {
    // Optional link
    href?: string
}

/** Shows the status of DataIntegration activities and supports actions on these activities. */
export function ActivityControl(props: IActivityControlProps) {
    const {"data-test-id": dataTestId, progress, activityActions, activityContextMenu} = props

    /* TODO, add spinner option
    <OverviewItemDepiction>
        <Spinner position="inline" value={progress?.value} intent={progress?.intent}/>
    </OverviewItemDepiction>
    */
    return (
        <div className={`${eccgui}-addon-activitycontrol`}>
        <Card isOnlyLayout>
            <OverviewItem data-test-id={dataTestId} hasSpacing>
                {progress && <ProgressBar
                    intent={"success"}
                    animate={false}
                    stripes={false}
                    {...progress}
                />}
                <OverviewItemDescription>
                    {props.label && <OverviewItemLine>
                        {props.label}
                    </OverviewItemLine>}
                    {props.statusMessage && (
                        <OverviewItemLine small>
                            {
                                props.statusMessage.length > 50 ? (
                                    <Tooltip content={props.statusMessage}>
                                        <OverflowText inline={true}>
                                            {props.statusMessage}
                                        </OverflowText>
                                    </Tooltip>
                                ) : (
                                    <OverflowText inline={true}>
                                        {props.statusMessage}
                                    </OverflowText>
                                )
                            }
                        </OverviewItemLine>
                    )}
                </OverviewItemDescription>
                <OverviewItemActions>
                    {activityActions && activityActions.map((action) => {
                        return <IconButton
                            key={action.icon}
                            data-test-id={action["data-test-id"]}
                            name={action.icon}
                            text={action.tooltip}
                            onClick={action.action}
                            tooltipOpenDelay={200}
                        />
                    })}
                    {activityContextMenu && activityContextMenu.menuItems.length > 0 && <ContextMenu
                        data-test-id={activityContextMenu["data-test-id"]}
                        togglerText={activityContextMenu.tooltip}
                    >
                        {activityContextMenu.menuItems.map((menuAction) => {
                            return <MenuItem
                                icon={menuAction.icon}
                                key={menuAction.icon}
                                onClick={menuAction.action}
                                text={menuAction.tooltip}
                            />
                        })}
                    </ContextMenu>
                    }
                </OverviewItemActions>
            </OverviewItem>
        </Card>
        </div>
    );
}
