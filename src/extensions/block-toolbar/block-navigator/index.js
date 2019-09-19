/**
 * Internal dependencies
 */
import NavigatorToolbar from './components/controls';

/**
 * WordPress Dependencies
 */
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { createHigherOrderComponent } = wp.compose;

const allowedBlocks = ['core/columns', 'core/column'];

/**
 * Override the default edit UI to include a new block toolbar control
 *
 * @param {function|Component} BlockEdit Original component.
 * @return {string} Wrapped component.
 */
const withNavigator = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		return (
			<Fragment>
				<BlockEdit {...props} />
				{props.isSelected && allowedBlocks.includes(props.name) && <NavigatorToolbar {...{ ...props }} />}
			</Fragment>
		);
	};
}, 'withNavigator');

addFilter(
	'editor.BlockEdit',
	'editorskit/media-text-link',
	withNavigator
);
