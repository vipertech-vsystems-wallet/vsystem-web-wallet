import React from "react";
import TimeAgo from "react-timeago";

export default class Transaction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            style: props.style,
            transaction: props.transaction,
            currency_change: props.currency_change,
            is_received: props.is_received,
            is_visible: props.is_visible,
            selected_currency: props.selected_currency,
            _clicked: false
        };
    };
    
    _toggle_clicked = () => {
      
        const _clicked = !this.state._clicked;
        this.setState({_clicked});
    };

    render() {

        const { style, transaction, currency_change, is_received, selected_currency, _clicked, is_visible } = this.state;
        
        const memo = transaction.memo.length ? transaction.memo: "-"; // Show memo or "-"
        const address = is_received ? transaction.sender: transaction.recipient; // Show useful address
        
        // Transaction icon
        let transaction_icon = is_received ?
            <svg viewBox="0 0 24 24"> <path fill="currentColor" d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z" /> </svg>:
            <svg viewBox="0 0 24 24"> <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" /> </svg>;
        transaction_icon = transaction.recipient == transaction.sender ? <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /> </svg>: transaction_icon;

        // Transaction icon class
        let transaction_color_class = is_received ? "green": "red";
        transaction_color_class = transaction.recipient == transaction.sender ? "": transaction_color_class;
        
        // Transaction full icon
        const transaction_full_icon = <button class={"circle button-inset " + transaction_color_class}>{transaction_icon}</button>;
        
        // Amount in fiat currency
        const amount_fiat = (transaction.amount * currency_change).toFixed(2);
        const amount_fiat_text = amount_fiat + " " + selected_currency.toUpperCase();
    
        const transaction_classes = "transaction-block " + (is_visible ? "is-visible": "is-invisible");
    
        const transaction_block_inner = !_clicked ? // Clicked or not -> Show address and memo or transaction info
            <div class={"transaction-block-inner card "}>
                {transaction_full_icon}
                <div class="transaction-data">
                    <div class="left">
                        <div class="row">VSYS</div>    
                        <div class="row bright">
                            <TimeAgo date={transaction.timestamp}/>
                        </div>    
                    </div>
                    <div class="right">
                        <div class={"row " + transaction_color_class}>{transaction.amount}</div>    
                        <div class="row bright">{amount_fiat_text}</div>                     
                    </div>
                </div>
            </div>:
            <div class="transaction-block-inner card">
                <div class="transaction-meta-data">
                    <div class="row address">{address}</div>    
                    <marquee class="row bright memo">
                        {memo}
                    </marquee>
                </div>
            </div>
        
            // Display styles passed in props for react virtualized or other things
         return (
            <div class={transaction_classes} style={style} onClick={this._toggle_clicked}>
                {transaction_block_inner}
            </div>
         );
    }
}