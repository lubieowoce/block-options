const {
	createContext,
	useContext,
} = wp.element;
const {	createHigherOrderComponent } = wp.compose;

const Context = createContext( null );
const { Provider, Consumer } = Context;

export { Provider as BlockEditPropsProvider };

export function useBlockEditProps() {
	return useContext( Context );
}

export const withBlockEditProps = ( mapContextToProps ) => (
	createHigherOrderComponent( ( OriginalComponent ) => {
		return ( props ) => (
			<Consumer>
				{ ( context ) => (
					<OriginalComponent
						{ ...props }
						{ ...mapContextToProps( context, props ) }
					/>
				) }
			</Consumer>
		);
	}, 'withBlockEditProps' )
);

export const withBlockEditPropsProvider = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		return (
			<Provider value={ props }>
				<BlockEdit { ...props } />
			</Provider>
		);
	};
}, 'withBlockEditPropsProvider' );
