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
            users: [],
            likedIds: []
        }
        this.renderList = this.renderList.bind(this);
        this.toogleLike = this.toogleLike.bind(this);
    }

    componentDidMount() {
        fetch('https://randomuser.me/api/?results=10', {
            method: 'get'
        }).then(res => res.json())
        .then(res => {
            this.setState({
                users: res.results
            })
        })
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
        return this.state.users.map(user => {
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

    render() {
        const { users } = this.state;
        return (
            <div className="container">
                {
                    users.length > 0
                    ? this.renderList()
                    : <p>Loading...</p>
                }
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)
