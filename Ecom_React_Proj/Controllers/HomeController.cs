using Ecom_React_Proj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ecom_React_Proj.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //AppDbContext db = new AppDbContext();
            //db.Database.CreateIfNotExists();
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            return View();
        }
    }
}