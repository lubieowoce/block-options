/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { compose, ifCondition } = wp.compose;
const { withSelect } = wp.data;
const { RichTextToolbarButton } = wp.blockEditor;

import { withBlockEditProps } from '../block-edit-context';

class DecreaseIndent extends Component {
	render() {
		const { attributes: { editorskit }, setAttributes } = this.props;

		const onToggle = () => {
			let indent = 0;

			if ( typeof editorskit !== 'undefined' && typeof editorskit.indent !== 'undefined' ) {
				indent = editorskit.indent;
			}

			delete editorskit.indent;

			const blockOptions = Object.assign( { indent: indent - 20 }, editorskit );

			setAttributes( { editorskit: blockOptions } );
		};

		return (
			<RichTextToolbarButton
				icon="editor-outdent"
				title={ __( 'Indent Decrease', 'block-options' ) }
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
	ifCondition( ( { isDisabled, attributes: { editorskit } } ) => {
		if ( isDisabled ) {
			return false;
		}

		if ( typeof editorskit.indent !== 'undefined' && editorskit.indent ) {
			return true;
		}
		return false;
	} )
)( DecreaseIndent );
