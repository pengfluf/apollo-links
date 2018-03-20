import React from 'react';
import { graphql } from 'react-apollo';

import { POST_MUTATION } from './gql/mutations';

class CreateLink extends React.Component {
  constructor() {
    super();

    this.state = {
      description: '',
      url: '',
    };

    this.handleChangeInput = this.handleChangeInput.bind(this);
    this._createLink = this._createLink.bind(this);
  }

  async _createLink() {
    const { description, url } = this.state;
    await this.props.postMutation({
      variables: {
        description,
        url,
      },
    });
  }

  handleChangeInput(fieldName, value) {
    this.setState({
      [fieldName]: value,
    });
  }

  render() {
    const { description, url } = this.state;
    return (
      <div>
        <div>
          <input
            value={description}
            onChange={(e) =>
              this.handleChangeInput('description', e.target.value)
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            value={url}
            onChange={(e) =>
              this.handleChangeInput('url', e.target.value)
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={this._createLink}>Post</button>
      </div>
    );
  }
}

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink);
