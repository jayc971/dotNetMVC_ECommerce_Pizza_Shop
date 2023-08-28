using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Ecom_React_Proj.Startup))]
namespace Ecom_React_Proj
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
