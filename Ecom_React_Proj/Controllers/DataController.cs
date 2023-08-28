using Ecom_React_Proj.Models;
using ReactAspx.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ecom_React_Proj.Controllers
{
    public class DataController : Controller
    {
        public IList<FoodItem> menuItems { get; set; }
        // GET: Data

        
        [HttpGet]
        public ActionResult GetMenuList()
        {
            menuItems = new List<FoodItem>();
            using (var db = new AppDbContext())
            {
                foreach (var item in db.FoodItems)
                {
                    menuItems.Add(item);
                }
            }
            return Json(menuItems, JsonRequestBehavior.AllowGet);
        }

        
        [HttpGet]
        [AuthorizeTPH]
        public string GetUserId()
        {
            int userId = -1;
            if (Session["UserId"] != null)
                userId = Convert.ToInt32(Session["UserId"].ToString());
            return userId.ToString();
        }

        
        [HttpPost]
        [AuthorizeTPH]
        public ActionResult PlaceOrder(IList<FoodItem>items,int id)
        {
            bool dbSuccess = false;
            try {
            using (var db = new AppDbContext())
            {
                Order odr = new Order();
                odr.CustomerId = id;
                odr.OrderDate = DateTime.Now;
                db.Orders.Add(odr);
                db.SaveChanges();

                int orderId = odr.Id;
                decimal grandTotal = 0;
                foreach(var item in items)
                {
                    OrderDetail orderDetail = new OrderDetail
                    {
                        OrderId = orderId,
                        FoodItemId = item.Id,
                        Quantity = item.Quantity,
                        TotalPrice = item.Price * item.Quantity,

                    };
                    db.OrderDetails.Add(orderDetail);
                    grandTotal += orderDetail.TotalPrice;
                }
                odr.TotalPaid = grandTotal;
                odr.Status = 1;
                odr.OrderDate = DateTime.Now;
                db.SaveChanges();
                dbSuccess = true;
            }
            }
            catch(Exception ex)
            {
                //log ex
                dbSuccess = false;
            }
            if (dbSuccess)

                return Json("success: true", JsonRequestBehavior.AllowGet);
            else
                return Json("success: false", JsonRequestBehavior.AllowGet);


        }
    }

    public class AuthorizeTPH : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null) throw new ArgumentNullException("httpContext");

            //checking if logged in or not
            if (httpContext.Session["Email"] == null)
            {
                return false;
            }
            return true;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
            if (this.AuthorizeCore(filterContext.HttpContext) == false)
            {
                filterContext.Result = new RedirectResult("Account/Login/?ret=" + filterContext.HttpContext.Request.CurrentExecutionFilePath);
            }
        }
    }
}