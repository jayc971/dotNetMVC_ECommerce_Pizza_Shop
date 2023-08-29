import * as React from "react";
import { FoodModel, IAppState } from "./Models";
import { Popup } from "./Popup";

export class MenuBox extends React.Component<any, IAppState>{
    constructor(state) {
        super(state);
        this.state = {
            isLoading: true,
            items: null,
            myOrder: null,
            showPopup: false,
            userId: 0,
            orderPlaced: false
        };
        this.getLoginStatus();
        this.loadMenusfromServer();
        this.handleDataFromChild = this.handleDataFromChild.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: false })
    }


    handleDataFromChild(popupShown, isOrderPlaced) {
        var tmp: IAppState = this.state;

        if (isOrderPlaced) {
            tmp.myOrder = null;
            tmp.orderPlaced = true;
            tmp.showPopup = false;
        } else {
            tmp.orderPlaced = false;
            tmp.showPopup = false;
        }

        this.setState(tmp);
    }


    getLoginStatus() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/data/GetUserId/', true);
        xhr.onload = function () {
            var userid: number = parseInt(xhr.responseText);
            if (!isNaN(userid)) {
                var tmp: IAppState = this.state;
                tmp.userId = userid;
                this.setState(tmp);
            }
        }.bind(this);
        xhr.send();
    }


    loadMenusfromServer() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/data/GetMenuList/', true);
        xhr.onload = function () {
            var dataItems = JSON.parse(xhr.responseText);
            var tmp: IAppState = this.state;
            tmp.items = dataItems;
            this.setState(tmp);
        }.bind(this);
        xhr.send();
    }

    

    checkIfLoggedIn() {
        if (this.state.userId < 1) {
            alert('Please login to continue');
            window.location.replace('/Account/Login');
            return;
        }
    }

    removeFromCart(id) {
        if (this.state.userId < 1) {
            alert('Please login to continue');
            window.location.replace('/Account/Login');
            return;
        }
        var myCart = this.state.myOrder || [];
        var allItems = this.state.items;
        let currntQty = myCart[id]["Quantity"];
        if (currntQty > 1) {
            myCart[id]["Quantity"] = myCart[id]["Quantity"] - 1;
        } else {
            myCart.splice(id, 1);
        }
        var tmp: IAppState = this.state;
        tmp.myOrder = myCart;
        this.setState(tmp);
    }

    flashQtyLabel(qtyId) {
        let qtyLabel = document.getElementById(qtyId);
        qtyLabel.classList.add("flash");
        setTimeout(() => {
            qtyLabel.classList.remove("flash")
        }, 500);
        return;
    }

    addToCart(id) {
        if (this.state.userId < 1) {
            alert('Please login to continue');
            window.location.replace('/Account/Login');
            return;
        }

        this.handleDataFromChild(false, false);
               
        id--;
        var myCart = this.state.myOrder || [];
        var allItems = this.state.items;
        if (myCart.indexOf(allItems[id]) > -1) {
            var itemToOrder = myCart.find(m => m.Id === allItems[id].Id);
            itemToOrder["Quantity"] = itemToOrder["Quantity"] + 1;
            window.location.replace('/#pizzaCart');
        }
        else {
            var itemToOrder = allItems[id];
            itemToOrder["Quantity"] = 1;
            myCart.push(allItems[id]);
            window.location.replace('/#pizzaCart');
        }

        var tmp: IAppState = this.state;
        tmp.myOrder = myCart;
        tmp.showPopup = false;
        this.setState(tmp);

        this.flashQtyLabel(`${id + 1}_qty__label`);
    }

    continueOrder() {
        var tmp: IAppState = this.state;
        tmp.showPopup = true;
        this.setState(tmp);
    }


    render() { 
        var cart = document.getElementById('pizzaCart');
        var menu = document.getElementById('pizzaMenu');
        var menuVar = " pizza-item d-flex  col-lg-4 col-md-6 col-xs-12  p-0 gap-2 text-justify p-2";
        var menuParVar = " col-lg-12 col-md-12 col-xs-12 row";

        if (this.state.userId < 1) {
            myItems = null;
            if (cart != null)
                cart.style.display = "none";
            if (menu != null)
                menuParVar = " col-lg-12 col-md-12 col-xs-12 row";
            menuVar = " pizza-item d-flex  col-lg-4 col-md-6 col-xs-12  p-0 gap-2 text-justify p-2";
        } else {
            if (cart != null)
                cart.style.display = "block";
            cart.classList.add("col-lg-3");
            if (menu != null)
                menuParVar = " col-lg-8 col-md-8 col-xs-12 row";
            menuVar = " pizza-item d-flex  col-lg-6 col-md-12 col-xs-12  p-0 gap-2 text-justify p-2";
        }

        let pendingMsg = <img className="w-100" src="./assets/loading.gif"/>;

        let menus = this.state.items || [];

        var menuList = [];

            menuList = menus.map((menu, index) => {

                if (menus.length - 1 !== index) {
                    pendingMsg = <></>
                }

                return (
                
                        <div key={menu.Id} className={menuVar}>
                            <div className={"position-relative"}>
                                <img className={"w-100 col-md-4 pizza__img"} src={'/assets/imgs/' + menu.Picture} alt={menu.Picture} />
                            </div>
                            <div className={"col-md-8 text-justify"}>
                                <b>{menu.Name}</b><br />
                                <p style={{ textAlign: "justify" }}>{menu.Description}</p>
                                <div className={"d-flex justify-content-between w-100"}><span><b>${menu.Price}</b></span>  <button className={"btn btn-outline-success"} onClick={this.addToCart.bind(this, menu.Id)}>Add to Cart</button></div>
                            </div>
                        </div>

                );

             


            }, this);

      
        var total = 0;
        let myCart = this.state.myOrder || [];
        var cartItemIndex = 0;
      
        var myItems = myCart.map(function (menu) {
            total += menu.Price * menu.Quantity;

            return (
                <div className="carted-pizza" key={menu.Id}>
                    <div><img style={{ width: '75px', float: 'left', margin: '5px' }} src={"/assets/imgs/" + menu.Picture} />
                    {menu.Name}<br />
                        Qty: <span className="qty__label" id={menu.Id + "_qty__label"}>{menu.Quantity}</span><br />
                        Price: ${menu.Price * menu.Quantity} <br /></div>
                    <div className={"w-100 d-flex justify-content-end gap-2"}><button className={"btn btn-outline-danger"} onClick={this.removeFromCart.bind(this, cartItemIndex++)}>-</button><button className={"btn btn-outline-success"} onClick={this.addToCart.bind(this, menu.Id)}>+</button></div>
                    <hr />
                </div>
            ); 
        }, this);

        var totalAndContinueLink = <div className="d-flex justify-content-between align-items-center"><p>Cart empty</p></div>

        if (total > 0)
            totalAndContinueLink = <div id={"proceed__atbottom"} className="d-flex justify-content-between align-items-center mb-3">
                Total: ${total}
                <button className="btn-success btn" onClick={this.continueOrder.bind(this) }>Proceed Order</button>
            </div>;
        
        

        if (this.state.orderPlaced === true) {
            total = 0;

            pendingMsg = <h1>Order Placed Successfully..</h1>

            menuList = [];

            myItems = [];

           cart.style.display = "none"
        }

       
        return (
            this.state.isLoading ?

                <h1>Loading...</h1>
                :
            <div>

                {this.state.showPopup ? <Popup
                        handlerFromParent={this.handleDataFromChild}
                        myOrder={this.state.myOrder}
                        userId={this.state.userId} /> : null}
                <div id="wrapper" className={"container"}>
                    <div className={"row py-2 gap-2"}>
                            <div id="pizzaMenu" className={menuParVar}>
                                {pendingMsg }
                            {menuList}
                            </div>
                            <div id="pizzaCart" className={`border m-2 col-lg-4 col-md-4 col-xs-4 col-lg-3`}>
                            <h4 className={"text-center justify-content-center pt-2"}>My Cart</h4><hr />{myItems}
                            {totalAndContinueLink}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}