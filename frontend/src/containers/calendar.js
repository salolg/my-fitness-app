import React from 'react';
import {Calendar, Badge } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Jourlnal from "../components/journal.js"



class UserCalendar extends React.Component {
  state = {
  }
 
  onSelectDate = date => {
    this.props.history.push('/kalendarz/' + date.format('YYYY-MM-DD'));
  }

  // dateCellRender(value) {
  //   console.log(value)
  //   return (
  //     <div>
  //       {value.date()}
  //     </div>
  //   );
  // }

  render() {
    return (
        <Calendar
            onSelect = {this.onSelectDate}
        />
    );
  }
}

export default UserCalendar;