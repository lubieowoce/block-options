/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const { compose, ifCondition } = wp.compose;
const { withSelect } = wp.data;
const { RichTextToolbarButton } = wp.blockEditor;

import { withBlockEditProps } from '../block-edit-context';

class JustifyControl extends Component {
	render() {
		const { attributes, setAttributes } = this.props;
		const isBlockJustified = 'justify' === get( attributes, 'align' );

		const onToggle = () => {
			setAttributes( { align: isBlockJustified ? null : 'justify' } );
		};
		return (
			<RichTextToolbarButton
				icon="editor-justify"
				title={ __( 'Justify', 'block-options' ) }
				onClick={ onToggle }
				isActive={ isBlockJustified }
			/>
		);
	}
}

export default compose(
	withBlockEditProps( ( { name, attributes, setAttributes } ) => ( {
		attributes,
		setAttributes,
		blockName: name,
	} ) ),
	withSelect( ( select ) => ( {
		isDisabled: select( 'core/edit-post' ).isFeatureActive( 'disableEditorsKitJustifyFormats' ),
		formatTypes: select( 'core/rich-text' ).getFormatTypes(),
	} ) ),
	ifCondition( ( { isDisabled, formatTypes, blockName } ) => {
		if ( isDisabled ) {
			return false;
		}
		const shouldHide = formatTypes.some( ( format ) => format.name === 'wpcom/justify' );
		return 'core/paragraph' === blockName && ! shouldHide;
	} )
)( JustifyControl );
