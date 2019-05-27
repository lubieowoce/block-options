/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, Component } = wp.element;
const { compose, ifCondition } = wp.compose;
const { select, withSelect, withDispatch } = wp.data;
const { applyFormat, getTextContent, slice, remove } = wp.richText;
const { withSpokenMessages } = wp.components;

class MarkdownControl extends Component {
	constructor() {
		super( ...arguments );

		this.state   = {
			start: null,
			end: null,
		}
	}

	_experimentalMarkdown( record ,onChange){
		const BACKTICK = '*';
		const { start, end } = record;
		const text = getTextContent( record );
		
		const characterBefore = text.slice( start - 1, start );
		// Quick check the text for the necessary character.
		if ( characterBefore !== BACKTICK ) {
			return record;
		}

		const textBefore = text.slice( 0, start - 1 );
		const indexBefore = textBefore.lastIndexOf( BACKTICK );

		if ( indexBefore === -1 ) {
			return record;
		}

		const startIndex = indexBefore;
		const endIndex = start - 2;
		
		if ( startIndex === endIndex ) {
			return record;
		}

		const characterAfter = text.slice( startIndex + 1, startIndex + 2 );

		//do not apply markdown when next character is SPACE
		if( characterAfter == " " ){
			return record;
		}

		record = remove( record, startIndex, startIndex + 1 );
		record = remove( record, endIndex, endIndex + 1 );
		record = applyFormat( record, { type: 'core/bold' }, startIndex, endIndex );

		// onSelectionChange( startIndex, endIndex );

		this.setState({ start: startIndex, end: endIndex });
		record.activeFormats = [];
		onChange( { ...record, needsSelectionUpdate: true } );
		console.log( record );
		
		return record;
	}

	render(){
		const { value, onChange, onSelectionChange } = this.props;
		this._experimentalMarkdown( value, onChange ) ;

		return null;
	}

}

export default compose(
	withSelect( ( select, {
		clientId,
		instanceId,
		identifier = instanceId,
		isSelected,
	} ) => {
		const selectedBlock = select( 'core/editor' ).getSelectedBlock();
		const { isCaretWithinFormattedText } = select( 'core/block-editor' );
		if ( ! selectedBlock ) {
			return {};
		}

		return {
			blockId: selectedBlock.clientId,
			blockName: selectedBlock.name,
			isCaretWithinFormattedText: isCaretWithinFormattedText(),
		};
	} ),
	withDispatch( ( dispatch, {
		clientId,
		instanceId,
		identifier = instanceId,
	} ) => {

		const {
			selectionChange,
		} = dispatch( 'core/block-editor' );

		return{
			updateBlockAttributes: dispatch( 'core/editor' ).updateBlockAttributes,
			onSelectionChange( start, end ) {
				selectionChange( clientId, identifier, start, end );
			}
		};
	}  ),
	ifCondition( props => 'core/paragraph' === props.blockName ),
	withSpokenMessages,
)( MarkdownControl );;