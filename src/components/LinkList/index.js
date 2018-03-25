import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import LinkCustom from '../LinkCustom';

import { LINKS_PER_PAGE } from './constants';
import { FEED_QUERY } from './gql/queries';

class LinkList extends React.Component {
  constructor() {
    super();

    this._updateCacheAfterVote = this._updateCacheAfterVote.bind(this);
    this._goToPrevPage = this._goToPrevPage.bind(this);
    this._goToNextPage = this._goToNextPage.bind(this);
    this._getLinksToRender = this._getLinksToRender.bind(this);
  }

  componentDidMount() {
    this._subscribeToNewLinks();
    this._subscribeToNewVotes();
  }

  _getLinksToRender(isNewPage) {
    const { feed } = this.props.feedQuery;
    if (feed && feed.links) {
      if (isNewPage) {
        return feed.links;
      }
      const rankedLinks = feed.links.slice();
      rankedLinks
        .sort((link1, link2) => link2.votes.length - link1.votes.length);
      return rankedLinks;
    }
    return [];
  }

  _goToPrevPage() {
    const pageNum = parseInt(this.props.match.params.pageNum, 10);
    if (pageNum > 1) {
      const prevPage = pageNum - 1;
      this.props.history.push(`/new/${prevPage}`);
    }
  }

  _goToNextPage() {
    const pageNum = parseInt(this.props.match.params.pageNum, 10);
    if (pageNum <= this.props.feedQuery.feed.count / LINKS_PER_PAGE) {
      const nextPage = pageNum + 1;
      this.props.history.push(`/new/${nextPage}`);
    }
  }

  _updateCacheAfterVote(store, createVote, linkId) {
    const isNewPage = this.props.location.pathname.includes('new');
    const pageNum = parseInt(this.props.match.params.pageNum, 10);
    const skip = isNewPage ? (pageNum - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;

    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy },
    });

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
    } = this.props.feedQuery;

    const isNewPage = this.props.location.pathname.includes('new');
    const linksToRender = this._getLinksToRender(isNewPage);

    if (feedQuery && loading) {
      return <div>Loading...</div>;
    }

    if (feedQuery && error) {
      return <div>Error</div>;
    }

    return (
      <div>
        {
          linksToRender.map((link, index) => (
            <LinkCustom
              index={index}
              key={link.id}
              link={link}
              updateStoreAfterVote={this._updateCacheAfterVote}
            />
          ))
        }
        {
          isNewPage &&
          <div>
            <button onClick={this._goToPrevPage}>
              Previous
            </button>
            <button onClick={this._goToNextPage}>
              Next
            </button>
          </div>
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
      count: PropTypes.number,
    }),
    subscribeToMore: PropTypes.func,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageNum: PropTypes.string,
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default graphql(FEED_QUERY, {
  name: 'feedQuery',
  options: (ownProps) => {
    const pageNum = parseInt(ownProps.match.params.pageNum, 10);
    const isNewPage = ownProps.location.pathname.includes('new');
    const skip = isNewPage ? (pageNum - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    return {
      variables: { first, skip, orderBy },
    };
  },
})(LinkList);
