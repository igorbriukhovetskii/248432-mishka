// Полифилл для внешних svg-спрайтов в ie
!function(root, factory) {
  "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
      return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
  /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
  function embed(parent, svg, target) {
    // if the target exists
    if (target) {
      // create a document fragment to hold the contents of the target
      var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
      // conditionally set the viewBox on the svg
      viewBox && svg.setAttribute("viewBox", viewBox);
      // copy the contents of the clone into the fragment
      for (// clone the target
        var clone = target.cloneNode(!0); clone.childNodes.length; ) {
        fragment.appendChild(clone.firstChild);
      }
      // append the fragment into the svg
      parent.appendChild(fragment);
    }
  }
  function loadreadystatechange(xhr) {
    // listen to changes in the request
    xhr.onreadystatechange = function() {
      // if the request is ready
      if (4 === xhr.readyState) {
        // get the cached html document
        var cachedDocument = xhr._cachedDocument;
        // ensure the cached html document based on the xhr response
        cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
          cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
          xhr._embeds.splice(0).map(function(item) {
            // get the cached target
            var target = xhr._cachedTarget[item.id];
            // ensure the cached target
            target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
              // embed the target into the svg
              embed(item.parent, item.svg, target);
          });
      }
    }, // test the ready state change immediately
      xhr.onreadystatechange();
  }
  function svg4everybody(rawopts) {
    function oninterval() {
      // while the index exists in the live <use> collection
      for (// get the cached <use> index
        var index = 0; index < uses.length; ) {
        // get the current <use>
        var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
        if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)),
          svg && src) {
          if (polyfill) {
            if (!opts.validate || opts.validate(src, svg, use)) {
              // remove the <use> element
              parent.removeChild(use);
              // parse the src and get the url and id
              var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
              // if the link is external
              if (url.length) {
                // get the cached xhr request
                var xhr = requests[url];
                // ensure the xhr request exists
                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                  xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                  xhr._embeds.push({
                    parent: parent,
                    svg: svg,
                    id: id
                  }), // prepare the xhr ready state change event
                  loadreadystatechange(xhr);
              } else {
                // embed the local id into the svg
                embed(parent, svg, document.getElementById(id));
              }
            } else {
              // increase the index when the previous value was not "valid"
              ++index, ++numberOfSvgUseElementsToBypass;
            }
          }
        } else {
          // increase the index when the previous value was not "valid"
          ++index;
        }
      }
      // continue the interval
      (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
    }
    var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
    polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
    // create xhr requests object
    var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
    // conditionally start the interval if the polyfill is active
    polyfill && oninterval();
  }
  function getSVGAncestor(node) {
    for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
    return svg;
  }
  return svg4everybody;
});

// Открытие/закрытие главного меню
!function () {
  var mainMenu = document.querySelector(".main-nav");
  var menuToggle = mainMenu.querySelector(".main-nav__toggle");

  if (mainMenu.classList.contains("main-nav--no-js")) {
    mainMenu.classList.remove("main-nav--no-js");
  }

  var openMenu = function () {
    mainMenu.classList.toggle("main-nav--opened");
  };

  var initializeMenu = function () {
    menuToggle.addEventListener("click", openMenu);
  };

  return initializeMenu();
}();

// Google карта
window.googleMapInit = function () {
  // Контейнер карты
  var mapContainer = document.querySelector(".map");
  // Центр вьюпорта карты
  var mapCenter = {lat: 59.938594, lng: 30.323083};
  // Координаты маркера магазина
  var mishka = {lat: 59.938594, lng: 30.323083};
  var map;
  var marker;

  //Создание кастомного маркера
  var setMarkers = function () {
    var image = {
      // Адрес иконки маркера
      url: "../img/icon-map-pin.svg",
      // Размеры маркера
      size: new google.maps.Size(66, 100),
      origin: new google.maps.Point(0, 0),
      // Точка привязки маркера
      anchor: new google.maps.Point(33, 100),
      scaledSize: new google.maps.Size(66, 100)
    };

    marker = new google.maps.Marker({
      position: mishka,
      map: map,
      icon: image,
      optimized: false
    });
  };

  // Инициализация карты
  var initMap = function () {
    map = new google.maps.Map(mapContainer, {
      center: mapCenter,
      zoom: 17,
      // Отключение интерфейса по умолчанию
      disableDefaultUI: true
    });

    setMarkers(map);

    /**
     * Обновление координат карты относительно вьюпорта при изменении размера
     * контейнера карты. При этом центр карты сохраняет свою позицию относительно
     * вьюпорта.
     */
    map.addListener("center_changed", function () {
      map.panTo(mapCenter);
    });
  };

  return initMap;
}();

// Модальное окно заказа товара
window.modal = function () {
  if (document.querySelector(".product__add-button")) {
    var addButtons = document.querySelectorAll(".product__add-button");
    var modal = document.querySelector(".modal");
    var submitButton = modal.querySelector("button[type='submit']");
    var ESC__KEYCODE = 27;

    // Открытие модального окна
    var openModal = function (event) {
      event.preventDefault();
      modal.classList.add("modal--show");
      window.addEventListener("keydown", onEscPressed);
      submitButton.addEventListener("click", closeModal);
      modal.addEventListener("click", onOverlayClick);
      for (var i = 0; i < addButtons.length; i++) {
        addButtons[i].removeEventListener("click", openModal);
      }
    };

    // Закрытие модального окна
    var closeModal = function () {
      modal.classList.remove("modal--show");
      initModal();
    };

    // Закрытие модального окна при нажатии клавиши escape
    var onEscPressed = function (event) {
      if (event.keyCode === ESC__KEYCODE) {
        closeModal();
      }
    };

    // Закрытие модального окна при клике на оверлее, за пределами модального окна
    var onOverlayClick = function (event) {
      if (event.target === modal) {
        closeModal();
      }
    };

    var initModal = function () {
      window.removeEventListener("click", onEscPressed);
      modal.removeEventListener("click", onOverlayClick);
      submitButton.removeEventListener("click", closeModal);
      for (var i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener("click", openModal)
      }
    };

    return {
      initModal: initModal
    }
  } else {
    return -1;
  }
}();

svg4everybody();

if (document.querySelector(".product__add-button")) {
  window.modal.initModal();
}
