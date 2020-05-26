import React from 'react';

class DisplayLogo extends React.Component {

  render() {
    return (
        <img src={ require('../static/main_page.PNG') }
            style = {{marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto', display: 'block'}}
        ></img> 
    );
  }
}

export default DisplayLogo;
