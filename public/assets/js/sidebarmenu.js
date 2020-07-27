// ==============================================================
// Auto select left navbar
// ============================================================== 
$(function () {
     var url = window.location + "";
        var path = url.replace(window.location.protocol + "//" + window.location.host + "/", "");
        var element = $('ul#sidebarnav a').filter(function() {
            return this.href === url || this.href === path;// || url.href.indexOf(this.href) === 0;
        });

        element.parentsUntil(".sidebar-nav").each(function (index)
        {
            if($(this).is("li") && $(this).children("a").length !== 0)
            {
                $(this).parent("ul#sidebarnav").length === 0
                    ? $(this).addClass("active")
                    : $(this).addClass("selected");
            }
            else if(!$(this).is("ul") && $(this).children("a").length === 0)
            {
                $(this).addClass("selected");
            }
            else if($(this).is("ul")){
                $(this).show();
            }
        });

    element.addClass("active"); 
    $('#sidebarnav a').on('click', function (e) {
        
            if (!$(this).hasClass("active")) {
                // hide any open menus and remove all other classes
                $("ul", $(this).parents("ul:first")).removeClass("in");
                $("a", $(this).parents("ul:first")).removeClass("active");
                
                // open our new menu and add the open class
                $(this).next("ul").addClass("in");
                $(this).addClass("active");
                
            }
            else if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).parents("ul:first").removeClass("active");
                $(this).next("ul").removeClass("in");
            }
    })
    $('#sidebarnav >li >a.has-arrow').on('click', function (e) {
        e.preventDefault();
    });
});

/* Custom.js */
$(function () {
    "use strict";
    $(function () {
        $(".preloader").fadeOut();
    }),
        jQuery(document).on("click", ".mega-dropdown", function (e) {
            e.stopPropagation();
        });
    var e = function () {
        (window.innerWidth > 0 ? window.innerWidth : this.screen.width) < 1170 ? ($("body").addClass("mini-sidebar"), $(".sidebartoggler i").addClass("ti-menu")) : $("body").removeClass("mini-sidebar");
        var e = (window.innerHeight > 0 ? window.innerHeight : this.screen.height) - 1;
        (e -= 75) < 1 && (e = 1), e > 75 && $(".page-wrapper").css("min-height", e + "px");
    };
    $(window).ready(e),
        $(window).on("resize", e),
        $(".sidebartoggler").on("click", function () {
            $("body").toggleClass("mini-sidebar");
        }),
        $(".nav-toggler").on("click", function () {
            $("body").toggleClass("show-sidebar");
        }),
        $(".nav-lock").on("click", function () {
            $("body").toggleClass("lock-nav"), $(".page-wrapper").trigger("resize");
        }),
        $(".search-box a, .search-box .app-search .srh-btn").on("click", function () {
            $(".app-search").toggle(200), $(".app-search input").focus();
        }),
        $(".right-side-toggle").click(function () {
            $(".right-sidebar").slideDown(50), $(".right-sidebar").toggleClass("shw-rside");
        }),
        $(".floating-labels .form-control")
            .on("focus blur", function (e) {
                $(this)
                    .parents(".form-group")
                    .toggleClass("focused", "focus" === e.type || this.value.length > 0);
            })
            .trigger("blur"),
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }),
        $(function () {
            $('[data-toggle="popover"]').popover();
        }),
        $(".scroll-sidebar, .right-side-panel, .message-center, .right-sidebar").perfectScrollbar(),
        $("body, .page-wrapper").trigger("resize"),
        $(".list-task li label").click(function () {
            $(this).toggleClass("task-done");
        }),
        $('a[data-action="collapse"]').on("click", function (e) {
            e.preventDefault(), $(this).closest(".card").find('[data-action="collapse"] i').toggleClass("ti-minus ti-plus"), $(this).closest(".card").children(".card-body").collapse("toggle");
        }),
        $('a[data-action="expand"]').on("click", function (e) {
            e.preventDefault(), $(this).closest(".card").find('[data-action="expand"] i').toggleClass("mdi-arrow-expand mdi-arrow-compress"), $(this).closest(".card").toggleClass("card-fullscreen");
        }),
        $('a[data-action="close"]').on("click", function () {
            $(this).closest(".card").removeClass().slideUp("fast");
        });
    var i,
        o = ["skin-default", "skin-green", "skin-red", "skin-blue", "skin-purple", "skin-megna", "skin-default-dark", "skin-green-dark", "skin-red-dark", "skin-blue-dark", "skin-purple-dark", "skin-megna-dark"];
    function a(e) {
        var i, a;
        return (
            $.each(o, function (e) {
                $("body").removeClass(o[e]);
            }),
                $("body").addClass(e),
                (i = "skin"),
                (a = e),
                "undefined" != typeof Storage ? localStorage.setItem(i, a) : window.alert("Please use a modern browser to properly view this template!"),
                !1
        );
    }
    (i = void ("undefined" != typeof Storage || window.alert("Please use a modern browser to properly view this template!"))) && $.inArray(i, o) && a(i),
        $("[data-skin]").on("click", function (e) {
            $(this).hasClass("knob") || (e.preventDefault(), a($(this).data("skin")));
        }),
        $("#themecolors").on("click", "a", function () {
            $("#themecolors li a").removeClass("working"), $(this).addClass("working");
        }),
        $(".custom-file-input").on("change", function () {
            var e = $(this).val();
            $(this).next(".custom-file-label").html(e);
        });
});
