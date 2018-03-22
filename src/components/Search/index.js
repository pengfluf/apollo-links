import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import { handleChangeInput } from '../../utils';

import { FEED_SEARCH_QUERY } from './gql/queries';

import LinkCustom from '../LinkCustom';

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      links: [],
      filter: '',
    };

    this.setState = this.setState.bind(this);
    this._executeSearch = this._executeSearch.bind(this);
  }

  async _executeSearch() {
    const { filter } = this.state;
    const result = await this.props.client
      .query({
        query: FEED_SEARCH_QUERY,
        variables: {
          filter,
        },
      });
    const { links } = result.data.feed;
    this.setState({ links });
  }

  render() {
    const { links, filter } = this.state;
    return (
      <div>
        <span>Search</span>
        <input
          value={filter}
          onChange={(e) => handleChangeInput('filter', e.target.value, this.setState)}
          type="text"
        />
        <button
          onClick={this._executeSearch}
        >
          OK
        </button>
        <div>
          {
            links.map((link, index) => (
              <LinkCustom
                key={link.id}
                link={link}
                index={index}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  client: PropTypes.shape({
    query: PropTypes.func,
  }),
};

export default withApollo(Search);
