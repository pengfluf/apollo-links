import React from 'react';
import PropTypes from 'prop-types';

class LinkCustom extends React.Component {
  async _voteForLink() {

  }

  render() {
    return (
      <div>
        <div>
          {this.props.link.description} ({this.props.link.url})
        </div>
      </div>
    );
  }
}

LinkCustom.propTypes = {};

export default LinkCustom;
