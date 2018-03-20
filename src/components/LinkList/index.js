import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import LinkCustom from '../LinkCustom';

import { FEED_QUERY } from './gql/queries';

function LinkList(props) {
  const { feedQuery } = props;

  const {
    loading,
    error,
    feed,
  } = props.feedQuery;

  if (feedQuery && loading) {
    return <div>Loading...</div>;
  }

  if (feedQuery && error) {
    return <div>Error</div>;
  }

  return (
    <div>
      {
        feed.links.map((link) => (
          <LinkCustom
            key={link.id}
            link={link}
          />
        ))
      }
    </div>
  );
}

LinkList.propTypes = {
  feedQuery: PropTypes.object,
};

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);
