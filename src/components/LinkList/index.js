import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import LinkCustom from '../LinkCustom';

import { FEED_QUERY } from './gql/queries';

class LinkList extends React.Component {
  constructor() {
    super();

    this._updateCacheAfterVote = this._updateCacheAfterVote.bind(this);
  }

  _updateCacheAfterVote(store, createVote, linkId) {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links
      .find((link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  }

  render() {
    const { feedQuery } = this.props;

    const {
      loading,
      error,
      feed,
    } = this.props.feedQuery;

    if (feedQuery && loading) {
      return <div>Loading...</div>;
    }

    if (feedQuery && error) {
      return <div>Error</div>;
    }

    return (
      <div>
        {
          feed.links.map((link, index) => (
            <LinkCustom
              index={index}
              key={link.id}
              link={link}
              updateStoreAfterVote={this._updateCacheAfterVote}
            />
          ))
        }
      </div>
    );
  }
}

LinkList.propTypes = {
  feedQuery: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    feed: PropTypes.shape({
      links: PropTypes.array,
    }),
  }),
};

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);
