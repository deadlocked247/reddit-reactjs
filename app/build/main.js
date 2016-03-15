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
                    { className: "center" },
                    React.createElement(
                        "svg",
                        { className: "like", version: "1.1", width: "24", height: "24", viewBox: "0 0 24 24" },
                        React.createElement("path", { d: "M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10.08L23,10M1,21H5V9H1V21Z" })
                    ),
                    React.createElement(
                        "p",
                        { className: "score" },
                        item.data.score
                    ),
                    React.createElement(
                        "svg",
                        { className: "dislike", version: "1.1", width: "24", height: "24", viewBox: "0 0 24 24" },
                        React.createElement("path", { d: "M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V13.91L1,14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z" })
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
            React.createElement("img", { src: "/app/reddit.svg", className: "reddit" }),
            React.createElement(
                "div",
                { className: "nav" },
                React.createElement(Navigation, { activeUrl: this.state.activeNavigationUrl,
                    items: this.state.navigationItems,
                    itemSelected: this.setSelectedItem }),
                React.createElement(StoryList, { items: this.state.storyItems })
            )
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