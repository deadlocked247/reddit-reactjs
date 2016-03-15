/* babel --presets react app/main.js --watch --out-dir app/build */
var NavigationItem = React.createClass({
    displayName: "NavigationItem",

    onClick: function () {
        this.props.itemSelected(this.props.item);
    },
    render: function () {
        return React.createElement(
            "li",
            { onClick: this.onClick, className: this.props.selected ? "selected" : "" },
            this.props.item.data.display_name
        );
    }
});

var Navigation = React.createClass({
    displayName: "Navigation",

    setSelectedItem: function (item) {
        this.props.itemSelected(item);
    },
    render: function () {
        var _this = this;

        var items = this.props.items.map(function (item) {
            return React.createElement(NavigationItem, { key: item.data.id,
                item: item, itemSelected: _this.setSelectedItem,
                selected: item.data.url === _this.props.activeUrl });
        });

        return React.createElement(
            "div",
            { className: "navigation" },
            React.createElement(
                "div",
                { className: "header" },
                "Navigation"
            ),
            React.createElement(
                "ul",
                null,
                items
            )
        );
    }
});

var StoryList = React.createClass({
    displayName: "StoryList",

    render: function () {
        var storyNodes = this.props.items.map(function (item) {
            return React.createElement(
                "tr",
                { key: item.data.url },
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "p",
                        { className: "score" },
                        item.data.score
                    )
                ),
                React.createElement(
                    "td",
                    null,
                    React.createElement(
                        "p",
                        { className: "title" },
                        React.createElement(
                            "a",
                            { href: item.data.url },
                            item.data.title
                        )
                    ),
                    React.createElement(
                        "p",
                        { className: "author" },
                        "Posted by ",
                        React.createElement(
                            "b",
                            null,
                            item.data.author
                        )
                    )
                )
            );
        });

        return React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                storyNodes
            )
        );
    }
});

var App = React.createClass({
    displayName: "App",

    componentDidMount: function () {
        var _this = this;
        var cbname = "fn" + Date.now();
        var script = document.createElement("script");
        script.src = "https://www.reddit.com/reddits.json?jsonp=" + cbname;

        window[cbname] = function (jsonData) {
            _this.setState({
                navigationItems: jsonData.data.children
            });
            delete window[cbname];
        };

        document.head.appendChild(script);
    },
    getInitialState: function () {
        return {
            activeNavigationUrl: "",
            navigationItems: [],
            storyItems: [],
            title: "Please select a sub"
        };
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                null,
                this.state.title
            ),
            React.createElement(Navigation, { activeUrl: this.state.activeNavigationUrl,
                items: this.state.navigationItems,
                itemSelected: this.setSelectedItem }),
            React.createElement(StoryList, { items: this.state.storyItems })
        );
    },
    setSelectedItem: function (item) {
        var _this = this;
        var cbname = "fn" + Date.now();
        var script = document.createElement("script");
        script.src = "https://www.reddit.com/" + item.data.url + ".json?sort=top&t=month&jsonp=" + cbname;

        window[cbname] = function (jsonData) {
            _this.setState({ storyItems: jsonData.data.children });
            delete window[cbname];
        };

        document.head.appendChild(script);

        this.setState({
            activeNavigationUrl: item.data.url,
            title: item.data.display_name
        });
    }
});

React.render(React.createElement(App, null), document.getElementById("root"));