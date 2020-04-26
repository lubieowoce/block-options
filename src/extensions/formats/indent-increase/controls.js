/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { compose, ifCondition } = wp.compose;
const { withSelect } = wp.data;
const { RichTextToolbarButton } = wp.blockEditor;

import { withBlockEditProps } from '../block-edit-context';

class IncreaseIndent extends Component {
	render() {
		const { attributes: { editorskit }, setAttributes } = this.props;

		const onToggle = () => {
			let indent = 0;

			if ( typeof editorskit !== 'undefined' && typeof editorskit.indent !== 'undefined' ) {
				indent = editorskit.indent;
			}

			delete editorskit.indent;

			const blockOptions = Object.assign( { indent: indent + 20 }, editorskit );

			setAttributes( { editorskit: blockOptions } );
		};

		return (
			<RichTextToolbarButton
				icon="editor-indent"
				title={ __( 'Indent Increase', 'block-options' ) }
				onClick={ onToggle }
			/>
		);
	}
}

export default compose(
	withBlockEditProps( ( { attributes, setAttributes } ) => ( {
		attributes,
		setAttributes,
	} ) ),
	withSelect( ( select ) => ( {
		isDisabled: select( 'core/edit-post' ).isFeatureActive( 'disableEditorsKitIndentFormats' ),
	} ) ),
	ifCondition( ( { isDisabled } ) => ( ! isDisabled ) /*&& props.selectedBlock*/ ),
)( IncreaseIndent );
