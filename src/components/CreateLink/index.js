import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { POST_MUTATION } from './gql/mutations';
import { FEED_QUERY } from '../LinkList/gql/queries';

import { LINKS_PER_PAGE } from '../LinkList/constants';

import { handleChangeInput } from '../../utils';

class CreateLink extends React.Component {
  constructor() {
    super();

    this.state = {
      description: '',
      url: '',
    };

    this.setState = this.setState.bind(this);
    this._createLink = this._createLink.bind(this);
  }

  async _createLink() {
    const { description, url } = this.state;
    await this.props.postMutation({
      variables: {
        description,
        url,
      },

      update: (store, { data: { post } }) => {
        const first = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = 'createdAt_DESC';

        const data = store
          .readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy },
          });

        data.feed.links.splice(0, 0, post);
        data.feed.links.pop();
        store.writeQuery({
          query: FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        });
      },
    });

    this.props.history.push('/');
  }

  render() {
    const { description, url } = this.state;
    return (
      <div>
        <div>
          <input
            value={description}
            onChange={(e) =>
              handleChangeInput('description', e.target.value, this.setState)
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            value={url}
            onChange={(e) =>
              handleChangeInput('url', e.target.value, this.setState)
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

CreateLink.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  postMutation: PropTypes.func,
};

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink);
