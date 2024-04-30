import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Dimensions, StyleSheet, Platform, } from 'react-native';
import { fullOptions, basicOptions } from '../constants/toolbar-options';
import { lightTheme, darkTheme } from '../constants/themes';
import { getToolbarData } from '../utils/toolbar-utils';
import { ToolbarProvider } from './components/toolbar-context';
import { SelectionBar } from './components/selection-bar';
import { ToolSet } from './components/tool-set';
import { ToolbarSeparator } from './components/toolbar-separator';
const WIDTH = Dimensions.get('window').width;
export class QuillToolbar extends Component {
    constructor(props) {
        super(props);
        this.prepareIconset = () => {
            const { options, custom } = this.props;
            let toolbarOptions = [];
            if (options === 'full' || options === []) {
                toolbarOptions = fullOptions;
            }
            else if (options === 'basic') {
                toolbarOptions = basicOptions;
            }
            else {
                toolbarOptions = options;
            }
            const toolSets = getToolbarData(toolbarOptions, custom?.icons, this.state.defaultFontFamily);
            this.setState({ toolSets });
        };
        this.listenToEditor = () => {
            setTimeout(() => {
                const { editor: { current }, } = this.props;
                if (current) {
                    this.editor = current;
                    current.on('format-change', this.onFormatChange);
                    if (this.editor?.props.defaultFontFamily) {
                        this.setState({
                            defaultFontFamily: this.editor?.props.defaultFontFamily,
                        });
                    }
                }
            }, 200);
        };
        this.onFormatChange = (data) => {
            this.setState({ formats: data.formats });
        };
        this.format = (name, value) => {
            this.editor?.format(name, value);
        };
        this.renderToolbar = () => {
            const { styles, custom } = this.props;
            const { toolSets, theme, formats } = this.state;
            const defaultStyles = makeStyles(theme);
            const toolbarStyle = styles?.toolbar?.root
                ? styles?.toolbar?.root(defaultStyles.toolbar)
                : defaultStyles.toolbar;
            return (React.createElement(ToolbarProvider, { theme: theme, format: this.format, selectedFormats: formats, custom: custom, styles: styles },
                React.createElement(SelectionBar, null),
                React.createElement(View, { style: toolbarStyle },
                    React.createElement(ScrollView, { horizontal: true, bounces: false, showsHorizontalScrollIndicator: false }, toolSets.map((object, index) => {
                        return (object.length > 0 && (React.createElement(React.Fragment, { key: index },
                            React.createElement(ToolSet, { tools: object }),
                            toolSets.length > index && (React.createElement(ToolbarSeparator, { color: theme.color })))));
                    })))));
        };
        this.state = {
            toolSets: [],
            formats: {},
            theme: lightTheme,
            defaultFontFamily: undefined,
        };
    }
    componentDidMount() {
        this.listenToEditor();
        this.prepareIconset();
        this.changeTheme();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.options !== this.props.options ||
            prevState.defaultFontFamily !== this.state.defaultFontFamily) {
            this.prepareIconset();
        }
        if (prevProps.theme !== this.props.theme) {
            this.changeTheme();
        }
    }
    changeTheme() {
        let theme = lightTheme;
        if (this.props.theme === 'dark') {
            theme = darkTheme;
        }
        else if (this.props.theme !== 'light') {
            theme = this.props.theme;
        }
        this.setState({ theme });
    }
    render() {
        const { container = 'avoiding-view' } = this.props;
        if (container === 'avoiding-view')
            return (React.createElement(KeyboardAvoidingView, { onTouchStart: (e) => e.stopPropagation(), behavior: Platform.OS === 'ios' ? 'padding' : 'height' }, this.renderToolbar()));
        else if (container === false)
            return this.renderToolbar();
        else {
            const ContainerComponent = container;
            return React.createElement(ContainerComponent, null, this.renderToolbar());
        }
    }
}
QuillToolbar.defaultProps = {
    theme: 'dark',
};
const makeStyles = (theme) => StyleSheet.create({
    toolbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: WIDTH,
        padding: 2,
        backgroundColor: theme.background,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: theme.size + 8,
    },
});
