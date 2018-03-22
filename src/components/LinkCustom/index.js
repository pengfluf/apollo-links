import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import { AUTH_TOKEN } from '../Login/constants';

import { VOTE_MUTATION } from './gql/mutations';

import { timeDifferenceForDate } from '../../utils';

import './style.css';

class LinkCustom extends React.Component {
  constructor() {
    super();

    this._voteForLink = this._voteForLink.bind(this);
  }

  async _voteForLink() {
    const linkId = this.props.link.id;
    await this.props.voteMutation({
      variables: {
        linkId,
      },
      update: (store, { data: { vote } }) => {
        this.props.updateStoreAfterVote(store, vote, linkId);
      },
    });
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const {
      index,
      link,
    } = this.props;
    return (
      <div className="linkCustom">

        <div>
          <span>{index + 1}</span>
          {
            authToken && (
              <button
                className="linkCustom__vote"
                onClick={this._voteForLink}
              >
                ▲
              </button>
            )
          }
        </div>

        <div>
          <div>
            {link.description} ({link.url})
          </div>
          <div>
            {link.votes.length} votes | by{' '}
            {
              link.postedBy ?
                link.postedBy.name :
                'Unknown'
            }
            {' '}
            {timeDifferenceForDate(link.createdAt)}
          </div>
        </div>

      </div>
    );
  }
}

LinkCustom.propTypes = {
  index: PropTypes.number,
  link: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    votes: PropTypes.array,
    postedBy: PropTypes.shape({
      name: PropTypes.string,
    }),
    createdAt: PropTypes.string,
  }),
  voteMutation: PropTypes.func,
  updateStoreAfterVote: PropTypes.func,
};

export default graphql(VOTE_MUTATION, { name: 'voteMutation' })(LinkCustom);
