define("app.ini", [], function() {
    var e;
    return e = {
        version: {
            main: 4,
            sub: 0
        },
        namespace: {
            prefix: "_Paletton",
            widgetPrefix: "_Paletton_Widget",
            prefixID: "paletton"
        },
        cookie: {
            settings: "Paletton",
            settingsExp: 35,
            returning: "rv"
        },
        lang: {
            def: "en",
            active: null,
            path: "/js/lang/",
            list: {
                en: {
                    title: "English",
                    abbr: "EN",
                    enabled: !0
                },
                cs: {
                    title: "Česky",
                    abbr: "CS",
                    enabled: !0
                },
                ru: {
                    title: "Русский",
                    abbr: "RU",
                    enabled: !0
                },
                es: {
                    title: "Español",
                    abbr: "ES",
                    enabled: !1
                }
            }
        },
        urls: {
            "export": {
                url: "export/index.php"
            },
            palette: {
                url: "/palette.php"
            },
            about: {
                url: "/wiki/"
            },
            versions: {
                url: "/wiki/index.php?title=Paletton_version_history"
            },
            version_prev: {
                url: "http://colorschemedesigner.com/csd-3.5/"
            },
            social_fb: {
                url: "https://www.facebook.com/Paletton"
            },
            social_tw: {
                url: "https://twitter.com/PalettonCom"
            },
            social_gplus: {
                url: "https://plus.google.com/118420217375686132904"
            },
            link_widget: {
                url: "/widget/"
            },
            link_mobile: {
                url: "",
                str: "app.header.mobile.desc"
            },
            link_more: {
                url: "",
                str: "app.header.more.desc"
            },
            email: {
                url: "info@paletton.com"
            }
        },
        GA: {
            view: {
                prefix: "/view/",
                title: "App",
                def: "default",
                presets: "presets",
                wheel: "wheel",
                example: "example",
                coltable: "coltable"
            },
            event: {
                enterRGB: "Enter RGB",
                enterHue: "Enter hue",
                enterDist: "Enter angle",
                preset: "Apply Preset",
                randomize: "Randomize",
                preview: "Set Preview",
                reset: "Reset",
                converter: "Vision sim.",
                adjust: "Fine tuner",
                redirect: "Redirect",
                language: "Language switch"
            }
        }
    }, e
});
