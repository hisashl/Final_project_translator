"use strict";
/**
 * Imported from RN .71
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is a helper function for when a component needs to be able to forward a ref
 * to a child component, but still needs to have access to that component as part of
 * its implementation.
 *
 * Its main use case is in wrappers for native components.
 *
 * Usage:
 *
 *   class MyView extends React.Component {
 *     _nativeRef = null;
 *
 *     _setNativeRef = setAndForwardRef({
 *       getForwardedRef: () => this.props.forwardedRef,
 *       setLocalRef: ref => {
 *         this._nativeRef = ref;
 *       },
 *     });
 *
 *     render() {
 *       return <View ref={this._setNativeRef} />;
 *     }
 *   }
 *
 *   const MyViewWithRef = React.forwardRef((props, ref) => (
 *     <MyView {...props} forwardedRef={ref} />
 *   ));
 *
 *   module.exports = MyViewWithRef;
 */
function setAndForwardRef(_a) {
    var getForwardedRef = _a.getForwardedRef, setLocalRef = _a.setLocalRef;
    return function forwardRef(ref) {
        var forwardedRef = getForwardedRef();
        setLocalRef(ref);
        // Forward to user ref prop (if one has been specified)
        if (typeof forwardedRef === 'function') {
            // Handle function-based refs. String-based refs are handled as functions.
            forwardedRef(ref);
        }
        else if (typeof forwardedRef === 'object' && forwardedRef != null) {
            // Handle createRef-based refs
            forwardedRef = ref;
        }
    };
}
exports.default = setAndForwardRef;
