import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import LinkCustom from '../LinkCustom';

import { FEED_QUERY } from './gql/queries';

class LinkList extends React.Component {
  constructor() {
    super();

    this._updateCacheAfterVote = this._updateCacheAfterVote.bind(this);
  }

  componentDidMount() {
    this._subscribeToNewLinks();
    this._subscribeToNewVotes();
  }

  _updateCacheAfterVote(store, createVote, linkId) {
    const data = store.readQuery({ query: FEED_QUERY });

    const votedLink = data.feed.links
      .find((link) => link.id === linkId);
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data });
  }

  _subscribeToNewLinks() {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newLink {
            node {
              id
              url
              description
              createdAt
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links];
        const result = {
          ...previous,
          feed: {
            links: newAllLinks,
          },
        };
        return result;
      },
    });
  }

  _subscribeToNewVotes() {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              link {
                id
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
    });
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
    subscribeToMore: PropTypes.func,
  }),
};

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);
