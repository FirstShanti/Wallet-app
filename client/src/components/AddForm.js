import React, {Component} from 'react'
import {InlineCreatePage} from '../pages/InlineCreatePage'
import { ReactComponent as LogoAdd } from '../icon-add.svg';



export class MyClickableComponent extends Component {
  state: {
    open: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  open = (event) => {
    event.preventDefault();
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false});
  };

  onChange = (event) => {
    const {id, onChange} = this.props;
    onChange(id, event.target.value);
    this.close();
  }

  render() {
    const {current} = this.props;
    const {open} = this.state;
    if (open) {
      return (
        <>
          <InlineCreatePage />
        </>
      );
    } else {
      return <LogoAdd className='addIcon' onClick={this.open} href='#' />;
    }
  }
}