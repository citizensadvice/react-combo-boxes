# Drop down with ARIA 1.2 groups

A drop down modified to use ARIA 1.2 groups.  In the main implementation groups are simulated using text label,
and are not associated with the option.  These are _true_ groups and can be associated with an option by a compatible screen-reader.

The group role is only been allowed as a child of a list box in [ARIA 1.2][1], which is still a working draft.

Therefore this is not compatible with the majority of screen readers and is only here as an example.

[1]: https://www.w3.org/TR/wai-aria-1.2/#substantive-changes-since-the-wai-aria-1-1-recommendation
