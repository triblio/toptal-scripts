! function(document, window) {
  var TRFooter = {
    insertAndExecuteIfElementInPage: function(e, t, i, r) {
      var n = function(e, t, i, r, c) {
        var d = document.querySelectorAll(e);
        if (d.length < 1) {
          if (r > 10) return;
          r++, setTimeout(function() {
            n(e, t, i, r, c)
          }, 5)
        } else if (t)
          for (var s = 0; s < d.length; s++) {
            var o = d[s];
            if (i) {
              var a = o.getAttribute(i);
              if (a && -1 !== a.indexOf(t)) {
                c();
                break
              }
            } else if (-1 !== o.innerHTML.indexOf(t)) {
              c();
              break
            }
          } else c()
      };
      n(t, i, r, 0, function() {
        TRFooter.insertAndExecute(e)
      })
    },
    insertAndExecute: function(text) {
      var div = document.createElement("div");
      div.className = "triblio-scripts", div.innerHTML = text, document.body.appendChild(div);
      for (var scripts = div.getElementsByTagName("script"), loadedSrcScripts = [], loadedInnerHTMLScripts = [], doSetTimeout = function(html) {
          window.TRHubPage ? html && eval(html) : setTimeout(function() {
            doSetTimeout(html)
          }, 350)
        }, i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if ("" !== src && -1 === loadedSrcScripts.indexOf(src)) {
          var tag = document.createElement("script");
          tag.src = src, document.getElementsByTagName("head")[0].appendChild(tag), loadedSrcScripts.push(src)
        } else {
          var html = scripts[i].innerHTML;
          "" !== html && -1 === loadedInnerHTMLScripts.indexOf(html) && (doSetTimeout(html), loadedInnerHTMLScripts.push(html))
        }
      }
    },
    insertAndExecuteTracking: function(text) {
      if (text) {
        var div = document.createElement("div");
        div.innerHTML = text, div.className = "triblio-scripts", document.body.appendChild(div);
        for (var scripts = div.getElementsByTagName("script"), loadedInnerHTMLScripts = [], loadedSrcScripts = [], i = 0; i < scripts.length; i++) {
          var src = scripts[i].src,
            html = scripts[i].innerHTML;
          if ("" !== src && -1 === loadedSrcScripts.indexOf(src)) {
            var script = document.createElement("script");
            script.src = src, document.getElementsByTagName("head")[0].appendChild(script), loadedSrcScripts.push(src)
          } else html && -1 === loadedInnerHTMLScripts.indexOf(html) && (eval(html), loadedInnerHTMLScripts.push(html))
        }
      }
    }
  };
  window.TRFooter = TRFooter
}(document, window);
TRFooter.insertAndExecute('');
TRFooter.insertAndExecuteTracking("<script type=\"text/javascript\" data-cfasync=\"false\">(function(w,d,s,src){w[\"TriblioAnalyticsObject\"] = {uid: \"EdOAdeaAj8s34gqB05v6\",site: \"eXb\"};var tag = d.createElement(s);var lastScript = d.getElementsByTagName(s)[0];tag.async = 1;tag.src = src;tag.setAttribute(\"data-cfasync\",\"false\");lastScript.parentNode.insertBefore(tag, lastScript);})(window, document, \"script\", \"//tribl.io/analytics.js\");</script>");
