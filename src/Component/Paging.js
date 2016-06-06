/**
 * Created by dalin on 16/6/6.
 */

import React from 'react';

const Component = React.Component;

export default class Paging extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let max = Math.ceil(this.props.size / this.props.length);
        return (
            <div className="clearfix" style={{height:35}}>
                <div className="clearfix" style={{float:"right",height:35}}>
                    {(()=> {
                        if (this.props.num < max)
                            return <div onClick={event=>this.props.click(event,max)} className="paging-group"><a href="javascript:void(0)">&gt;&gt;</a></div>;
                        else
                            return <div className="paging-group"><a style={{color:'#e5e5e5'}} href="javascript:void(0)">&gt;&gt;</a></div>
                    })()}
                    {(()=> {
                        if (this.props.num < max)
                            return <div onClick={event=>this.props.click(event,this.props.num+1)} className="paging-group"><a href="javascript:void(0)">&gt;</a></div>;
                        else
                            return <div className="paging-group"><a style={{color:'#e5e5e5'}} href="javascript:void(0)">&gt;</a></div>
                    })()}
                    {(()=> {
                        if (this.props.num + 4 <= max) {
                            let arr = [];
                            for (let i = this.props.num + 4; i > this.props.num - 1; i--) {
                                arr.push(<div onClick={event=>this.props.click(event,i)} key={i} className={this.props.num==i?"checked" : "paging-group"}><a
                                    href="javascript:void(0)">{i}</a>
                                </div>)
                            }
                            return arr
                        }
                        else if (this.props.num + 3 <= max) {
                            let arr = [];
                            for (let i = this.props.num + 3; i > this.props.num - 2 && i > 0; i--) {
                                arr.push(<div onClick={event=>this.props.click(event,i)} key={i} className={this.props.num==i?"checked" : "paging-group"}><a
                                    href="javascript:void(0)">{i}</a>
                                </div>)
                            }
                            return arr
                        }
                        else if (this.props.num + 2 <= max) {
                            let arr = [];
                            for (let i = this.props.num + 2; i > this.props.num - 3 && i > 0; i--) {
                                arr.push(<div onClick={event=>this.props.click(event,i)} key={i} className={this.props.num==i?"checked" : "paging-group"}><a
                                    href="javascript:void(0)">{i}</a>
                                </div>)
                            }
                            return arr
                        }
                        else if (this.props.num + 1 <= max) {
                            let arr = [];
                            for (let i = this.props.num + 1; i > this.props.num - 4 && i > 0; i--) {
                                arr.push(<div onClick={event=>this.props.click(event,i)} key={i} className={this.props.num==i?"checked" : "paging-group"}><a
                                    href="javascript:void(0)">{i}</a>
                                </div>)
                            }
                            return arr
                        }
                        else if (this.props.num <= max) {
                            let arr = [];
                            for (let i = this.props.num; i > this.props.num - 5 && i > 0; i--) {
                                arr.push(<div onClick={event=>this.props.click(event,i)} key={i} className={this.props.num==i?"checked" : "paging-group"}><a
                                    href="javascript:void(0)">{i}</a>
                                </div>)
                            }
                            return arr
                        }
                    })()}
                    {(()=> {
                        if (this.props.num > 1)
                            return <div onClick={event=>this.props.click(event,this.props.num-1)} className="paging-group"><a href="javascript:void(0)">&lt;</a></div>;
                        else
                            return <div className="paging-group"><a style={{color:'#e5e5e5'}} href="javascript:void(0)">&lt;</a></div>
                    })()}
                    {(()=> {
                        if (this.props.num > 1)
                            return <div onClick={event=>this.props.click(event,1)} className="paging-group"><a href="javascript:void(0)">&lt;&lt;</a></div>;
                        else
                            return <div className="paging-group"><a style={{color:'#e5e5e5'}} href="javascript:void(0)">&lt;&lt;</a></div>
                    })()}
                </div>
            </div>
        )
    }
}
