import React, { Component, useContext } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import { lightTheme } from '../../constants/themes';
const ToolbarContext = React.createContext({
    apply: () => { },
    show: () => { },
    hide: () => { },
    selectedFormats: {},
    open: false,
    isSelected: () => false,
    theme: lightTheme,
    options: [],
    selectionName: '',
    getSelected: () => false,
});
export const ToolbarConsumer = ToolbarContext.Consumer;
export class ToolbarProvider extends Component {
    constructor(props) {
        super(props);
        this.show = (name, options) => {
            if (this.state.isAnimating)
                return;
            const { theme } = this.props;
            if (theme) {
                this.setState({ options, name, isAnimating: true }, () => {
                    Animated.timing(this.animatedValue, {
                        toValue: 2 * theme.size + 14,
                        duration: 200,
                        easing: Easing.sin,
                        useNativeDriver: false,
                    }).start(() => this.setState({ open: true, isAnimating: false }));
                });
            }
        };
        this.hide = () => {
            if (this.state.isAnimating)
                return;
            const { theme } = this.props;
            if (theme) {
                this.setState({ isAnimating: true }, () => {
                    Animated.timing(this.animatedValue, {
                        toValue: theme.size + 10,
                        duration: 200,
                        easing: Easing.linear,
                        useNativeDriver: false,
                    }).start(() => {
                        this.setState({
                            name: '',
                            open: false,
                            options: [],
                            isAnimating: false,
                        });
                    });
                });
            }
        };
        this.isSelected = (name, value = true) => {
            const { selectedFormats } = this.props;
            const selected = selectedFormats[name];
            return selected ? selected === value : value === false;
        };
        this.getSelected = (name) => {
            const { selectedFormats } = this.props;
            const selected = selectedFormats[name];
            return selected ? selected : false;
        };
        this.apply = (name, value) => {
            const { format, custom } = this.props;
            if (custom?.actions)
                custom.actions.find((x) => x === name);
            if (custom?.actions && custom?.actions?.indexOf(name) > -1) {
                if (custom?.handler)
                    custom.handler(name, value);
            }
            else {
                format(name, value);
            }
        };
        this.state = {
            open: false,
            isAnimating: false,
            options: [],
            name: '',
        };
        this.animatedValue = new Animated.Value(0);
    }
    componentDidMount() {
        const { theme } = this.props;
        this.animatedValue = new Animated.Value(theme.size + 10);
    }
    render() {
        const { selectedFormats, children, theme, styles } = this.props;
        const { open, options, name } = this.state;
        const defaultStyles = makeStyles(theme);
        const rootStyle = styles?.toolbar?.provider
            ? styles?.toolbar?.provider(defaultStyles.root)
            : defaultStyles.root;
        return (React.createElement(ToolbarContext.Provider, { value: {
                selectedFormats,
                apply: this.apply,
                isSelected: this.isSelected,
                theme,
                open,
                show: this.show,
                hide: this.hide,
                getSelected: this.getSelected,
                selectionName: name,
                options,
                styles,
            } },
            React.createElement(Animated.View, { style: [
                    rootStyle,
                    {
                        height: this.animatedValue,
                    },
                ] }, children)));
    }
}
const makeStyles = (theme) => StyleSheet.create({
    root: {
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: theme.color,
        position: 'relative',
        backgroundColor: theme.background,
        width: '100%',
    },
});
export const withToolbar = (MyComponent) => {
    const WrappedComponent = React.forwardRef((props, ref) => (React.createElement(ToolbarContext.Consumer, null, (context) => (React.createElement(MyComponent, Object.assign({}, props, { ref: ref, apply: context.apply, selectedFormats: context.selectedFormats }))))));
    return WrappedComponent;
};
export const useToolbar = () => useContext(ToolbarContext);
