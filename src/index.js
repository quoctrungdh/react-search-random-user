import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card extends React.Component {
    render() {
        return (
            <div className="ui card">
                <div className="image">
                    <img src={this.props.img} alt=""/>
                </div>
                <div className="content">
                    <a href="" className="header">{this.props.name}</a>
                    <div className="meta">
                        <span className="data">{this.props.birthday}</span>
                    </div>
                    <div className="description">
                        {this.props.description}
                    </div>
                    <p>{this.props.email}</p>
                </div>
                <div className="extra content">
                    <a onClick={() => this.props.toogleLike(this.props.email)}>
                        <i className="user icon" />
                        {
                            this.props.liked
                            ? 'liked'
                            : 'like'
                        }
                    </a>
                </div>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            users: [],
            likedIds: [],
            filterText: ''
        }
        this.renderList = this.renderList.bind(this);
        this.toogleLike = this.toogleLike.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.scrollHandle = this.scrollHandle.bind(this);
        this.isPartiallyVisible = this.isPartiallyVisible.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }

    getUsers() {
        const { page, users } = this.state;
        return fetch(`https://randomuser.me/api/?results=10&page=${page}`, {
            method: 'get'
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                users: page === 1 ? res.results : [...users, ...res.results]
            })
        })
    }

    isPartiallyVisible(element) {
        const elementBoudary = element.getBoundingClientRect();
        const { top } = elementBoudary;
        const innerHeight = window.innerHeight;
        return innerHeight > top;
    }

    scrollHandle() {
        const isBottom = this.isPartiallyVisible(this.endTrigger);
        if (isBottom) {
            this.setState({
                page: this.state.page + 1
            }, () => {
                this.getUsers();
            });
        }
    }

    componentDidMount() {
        this.endTrigger = document.getElementById('end');
        window.addEventListener('mousewheel', (e) => {
            if (e.deltaY > 0) {
                // scroll DOWN only
                this.scrollHandle();
            }
        });
        this.getUsers();
    }

    toogleLike(userEmail) {
        const { likedIds } = this.state;
        const isLiked = likedIds.find((email) => email === userEmail);
        if(isLiked) {
            this.setState({
                likedIds: likedIds.filter(email => email !== userEmail)
            })
        } else {
            this.setState({
                likedIds: likedIds.concat(userEmail)
            })
        }
    }

    renderList() {
        const { filterText } = this.state;
        const filterByGender = (user) => {
            return filterText.length === 0 || (user.email).indexOf(filterText) !== -1
        }
        const filteredValues = this.state.users
            .filter(filterByGender);
        return filteredValues.map(user => {
            return (
                <Card
                    img={user.picture.large}
                    name={`${user.name.first} ${user.name.last}`}
                    birthday={user.dob}
                    description={user.phone}
                    key={user.email}
                    email={user.email}
                    toogleLike={this.toogleLike}
                    liked={this.state.likedIds.find(email => email === user.email)}
                />
            )
        })
    }

    changeFilter({ target }) {
        const { value } = target;
        this.setState({
            filterText: value
        })
    }

    render() {
        const { users } = this.state;
        return (
            <div className="container">
                <input
                    type="text"
                    onChange={this.changeFilter}
                    placeholder="Type to search..."
                />
                {
                    users.length > 0
                    ? this.renderList()
                    : <p>Loading...</p>
                }
                <div id='end' />
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
