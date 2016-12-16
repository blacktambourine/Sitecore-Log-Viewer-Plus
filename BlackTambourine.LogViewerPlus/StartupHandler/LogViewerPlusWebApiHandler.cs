using System.Web.Http;
using System.Web.Http.Routing;
using Sitecore.Pipelines;

namespace BlackTambourine.LogViewerPlus.StartupHandler
{
    public class LogViewerPlusWebApiHandler
    {
        public void Process(PipelineArgs args)
        {
            //add any additional routes e.g.
            GlobalConfiguration.Configuration.Routes.Add("LogViewerPlus", new HttpRoute("api/LogViewerPlus/{controller}/{action}"));
        }
    }
}