// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { FoodModel } from "./Models";


export class Popup extends React.Component<any, any> {	
	constructor(state) {
        super(state);
		this.state = { items: null, myOrder: null, showPopup: false, userId: 0, orderPlaced: false }; 
		 this.placeOrder = this.placeOrder.bind(this);
		 this.closePopup = this.closePopup.bind(this);
    }

	placeOrder() {
		var xhr = new XMLHttpRequest();
		xhr.open('post', "/data/PlaceOrder/" + this.props.userId, true);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.onreadystatechange = function () { 
			 if (xhr.readyState == 4 && xhr.status == 200) {
				 this.props.handlerFromParent(false, true);
			}
		}.bind(this);
		xhr.send(JSON.stringify(this.props.myOrder));
	}

	closePopup(){     
		this.props.handlerFromParent(false, false);
	}
 
	render() {
		var total = 0;
		var totalMsg = '';
		let myCart=this.props.myOrder || [];
		
		var myItems = myCart.map(function (menu) {

			total += menu.Price * menu.Quantity;
			return (
				<div key={menu.Id} className={"py-2" }>
					{menu.Name} X {menu.Quantity} {` ($${menu.Price * menu.Quantity})`}
				</div>
			);
		}, this);
        
		return (
			<div className={"modal"}>
				<div className={"modal-content"}>
					<div className={"modal-header"}>
						<span className={"close"} onClick={this.closePopup}>&times;</span>
      <h2>Order from The Pizza House</h2>
    </div>
					<div className={"modal-body gap-5 d-flex justify-content-space-between"}>
						<div className={"col-lg-6"}>
						<h5>Your Order:</h5>
						<h6 className={'foodList mb-2'}>{myItems}</h6></div>
						<div className={"col-lg-6" }>
						<h6>{`Order Id: ${new Date().getTime()}`}</h6>
						<h6>Total: ${(Math.round(total * 100) / 100).toFixed(2) }</h6>
						<h6>Tax: 0</h6>
						<h6>Payment:  [Credit Card on file will be Charged!]</h6>
							<h6>Deliver to (Address):</h6><textarea id="text__address" name="text__address" className={"w-100"} rows={4} cols={50}>
								767/4 A, Millagahawatte Road, Malabe
							</textarea>
      <p>Delivery estimates: 20 - 40 minutes</p>
						</div></div>
					<div className={"modal-footer"}>
						<button className={"btn btn-secondary"} onClick={this.closePopup}>Back</button>
						<button className={"btn btn-primary"} onClick={this.placeOrder}>Pay Now</button>
    </div>
  </div>

</div>









      );
}
}