! function(document, window) {
  var isArray = function(e) {
      return e instanceof Array
    },
    TRHero = {
      run: function(e) {
        if (window.TRHero.data = e, isArray(e))
          for (var t = 0; t < e.length; t += 1) _runOne(e[t]);
        else _runOne(e)
      }
    },
    _runOne = function(data) {
      var selector = data.selector;
      if ("eval" === data.directive) eval(data.data);
      else {
        if (!selector) return;
        lookForElement(selector, function(e) {
          runDirective(e, data.directive, data.data, data.tracking)
        })
      }
    },
    lookForElement = function(e, t) {
      var r = document.querySelector(e);
      r ? t(r) : setTimeout(function() {
        lookForElement(e, t)
      }, 3)
    },
    runDirective = function(e, t, r, n) {
      if ("text" === t) e.textContent ? e.textContent = r : e.innerText = r;
      else if ("image" === t) "img" === e.tagName.toLowerCase() ? e.src = r : e.style.backgroundImage = "url(" + r + ")";
      else if ("link" === t) e.href = r, e.setAttribute("data-tr", n);
      else if ("class" === t) {
        var a = "";
        r.forEach(function(e) {
          a += e.className + " "
        }), e.className = a
      } else if ("html" === t) e.innerHTML = r;
      else if ("addLink" === t)
        if (e.src) e.setAttribute("data-tr", n), e.onclick = function() {
          window.location.href = r
        };
        else {
          var i = e.innerHTML;
          e.innerHTML = '<a data-tr="' + n + '" href="' + r + '">' + i + "</a>"
        } else if ("attribute" === t) e.setAttribute(r.name, r.value);
      else if ("appendHtml" === t) e.insertAdjacentHTML("afterend", r);
      else if ("video" === t) {
        var o = e.getElementsByTagName("source");
        r.sources.forEach(function(e, t) {
          o[t] && (o[t].src = e.src)
        }), e.load()
      } else "removeElement" === t ? e.parentNode && e.parentNode.removeChild(e) : "redirect" === t && (window.location.href = r.redirectURL)
    };
  window.TRHero = TRHero
}(document, window);
(function(TRHero) {
  TRHero.run([])
})(TRHero);
(function() {
  window.TRPersonalizationConfig = {}
})();
